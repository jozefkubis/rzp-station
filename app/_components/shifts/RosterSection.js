"use client";

import { useRouter } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";
import DeleteAllShifts from "./DeleteAllShifts";
import DeleteOnlyShifts from "./DeleteOnlyShifts";
import GenerateShifts from "./GenerateShifts";
import InsertShiftButton from "./InsertShiftButton";
import ShiftLoader from "./ShiftLoader";
import ShiftsTable from "./ShiftsTable";
import { ShiftsTableLegend } from "./ShiftsTableLegend";
import ValidateButton from "./ValidateButton";

/**
 * RosterSection drží optimistický stav pre celú tabuľku.
 * Props:
 *   - initialShifts  : pole shiftov získané na serveri
 *   - diffProfiles   : voľní záchranári (pole { id, full_name })
 *   - initialShiftsOffset: offset pre pagináciu
 */
export default function RosterSection({
  initialShifts,
  diffProfiles,
  initialShiftsOffset,
  admin,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /* 🟡 1) useOptimistic nad SHIFTAMI (tabuľka) */
  const [optimShifts, applyShifts] = useOptimistic(
    initialShifts,
    (curr, act) => {
      if (act.type === "INSERT_EMPTY_PROFILE") {
        const alreadyExists = curr.some(
          (s) => s.user_id === act.userId && s.date === act.date,
        );
        if (alreadyExists) return curr;

        return [
          ...curr,
          {
            id: `tmp-${crypto.randomUUID()}`, // len kľúč pre React
            user_id: act.userId,
            date: act.date, // YYYY-MM-DD (prvý deň mesiaca)
            shift_type: null,
            profiles: {
              full_name: act.full_name,
              position: act.position,
              contract: act.contract,
            },
          },
        ];
      }
      return curr;
    },
  );

  /* 🟡 2) callback, ktorý odovzdáme InsertShiftButtonu */
  function handleInsertEmptyShift({ userId, full_name, position, contract }) {
    const firstOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    )
      .toISOString()
      .slice(0, 10); // YYYY-MM-01

    applyShifts({
      type: "INSERT_EMPTY_PROFILE",
      userId,
      full_name,
      date: firstOfMonth,
      position,
      contract,
    });
  }

  /* 🟡 3) useOptimistic pre shiftsTable - pre rychle prepinanie mesiacov v sluzbach */
  const [shiftsOptimOffset, setShiftsOptimOffset] = useOptimistic(
    initialShiftsOffset,
    (_, next) => next,
  );

  /* 🟡 4) callback, pre ShiftsTable */
  function goTo(offset) {
    startTransition(() => {
      setShiftsOptimOffset(offset);
    });

    router.push(`/shifts?m=${offset}`);
  }


  function useIsMdUp() {
    const [isMdUp, setIsMdUp] = useState(false);
    useEffect(() => {
      const mql = window.matchMedia("(min-width: 768px)");
      const update = () => setIsMdUp(mql.matches);
      update();
      mql.addEventListener?.("change", update);
      return () => mql.removeEventListener?.("change", update);
    }, []);
    return isMdUp;
  }

  const isMdUp = useIsMdUp();


  // MARK: RETURNT .......................................................................................
  return isMdUp ? (
    // ===== DESKTOP (tvoj pôvodný layout bezzmeny) =====
    <div className="flex w-full flex-col">
      {/* 1️⃣ centrovaná tabuľka s maximálnou šírkou kontajnera */}
      <div className="flex justify-center px-8">
        <div className="flex flex-col">
          <div className="max-w-full overflow-x-auto">
            <ShiftsTable
              shifts={optimShifts}
              goTo={goTo}
              shiftsOffset={shiftsOptimOffset}
              disabled={isPending}
              onInsertEmptyShift={handleInsertEmptyShift}
              admin={admin}
            />
            {isPending && <ShiftLoader />}
          </div>

          <div className="flex w-[100%] justify-between gap-2 pb-6 pt-8">
            <div>
              <ShiftsTableLegend />
            </div>

            {admin === "ÁNO" && (
              <div className="flex gap-2">
                <InsertShiftButton
                  profiles={diffProfiles}
                  onInsertEmptyShift={handleInsertEmptyShift}
                />
                {initialShifts.length > 0 && (
                  <>
                    <GenerateShifts />
                    <DeleteOnlyShifts />
                    <ValidateButton />
                    <DeleteAllShifts />
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    // ===== MOBILE (prvý koncept, vylepšený len pre mobil) =====
    <div className="flex w-full flex-col">
      {/* rezerva pre bottom toolbar */}
      <div className="mx-auto w-full pb-24">
        <div className="px-4">
          <div className="flex flex-col gap-4">
            {/* full-bleed horizontálny scroll s jemným náznakom */}
            <div className="relative -mx-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />

              <div className="max-w-full overflow-x-auto snap-x snap-mandatory">
                <div className="min-w-max snap-start">
                  <ShiftsTable
                    shifts={optimShifts}
                    goTo={goTo}
                    shiftsOffset={shiftsOptimOffset}
                    disabled={isPending}
                    onInsertEmptyShift={handleInsertEmptyShift}
                    admin={admin}
                  />
                </div>
              </div>

              {isPending && <ShiftLoader />}
            </div>

            {/* Legenda v collapsible, aby nezaberala miesto */}
            <div className="w-full">
              <details className="rounded-xl border shadow-md bg-white p-3">
                <summary className="cursor-pointer select-none text-sm font-semibold text-primary-700">
                  Legenda
                </summary>
                <div className="pt-3">
                  <ShiftsTableLegend />
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>

      {/* fixnutý admin toolbar naspodku (len ak si admin) */}
      {admin === "ÁNO" && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-3 py-2 backdrop-blur supports-[backdrop-filter]:bg-white/80">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <InsertShiftButton
              size="sm"
              profiles={diffProfiles}
              onInsertEmptyShift={handleInsertEmptyShift}
            />
            {initialShifts.length > 0 && (
              <>
                <GenerateShifts size="sm" />
                <DeleteOnlyShifts size="sm" />
                <ValidateButton size="sm" />
                <DeleteAllShifts size="sm" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
