"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useOptimistic, useState, useTransition } from "react";
import DeleteAllShifts from "./DeleteAllShifts";
import DeleteOnlyShifts from "./DeleteOnlyShifts";
import GenerateShifts from "./GenerateShifts";
import InsertShiftButton from "./InsertShiftButton";
import ShiftLoader from "./ShiftLoader";
// import ShiftsTable from "./ShiftsTable";
import { ShiftsTableLegend } from "./ShiftsTableLegend";
import ValidateButton from "./ValidateButton";

const ShiftsTable = dynamic(() => import("./ShiftsTable"), {
  ssr: false,
  loading: () => <ShiftLoader />,
});

/**
 * RosterSection drží optimistický stav pre celú tabuľku.
 * Props:
 *   - initialShifts  : pole shiftov získané na serveri
 *   - diffProfiles   : voľní záchranári (pole { id, full_name })
 *   - initialShiftsOffset: offset pre pagináciu
 */
export default function MobileRosterSection({
  initialShifts,
  diffProfiles,
  initialShiftsOffset,
  admin,
  user,
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [exportHandlers, setExportHandlers] = useState(null);

  // const isMd = useMedia();

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

  // MARK: RENDER .......................................................................................
  return (
    <div className="flex w-full flex-col lg:hidden">
      {/* rezerva pre bottom toolbar */}
      <div className="mx-auto w-full pb-10">
        <div className="px-4">
          <div className="flex flex-col gap-1">
            {/* full-bleed horizontálny scroll s jemným náznakom */}
            <div className="relative -mx-4">
              <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent" />

              <div className="max-w-full snap-x snap-mandatory">
                <div className="snap-start">
                  <ShiftsTable
                    shifts={optimShifts}
                    goTo={goTo}
                    shiftsOffset={shiftsOptimOffset}
                    disabled={isPending}
                    onInsertEmptyShift={handleInsertEmptyShift}
                    admin={admin}
                    user={user}
                  />
                </div>
              </div>

              {isPending && <ShiftLoader />}
            </div>

            {/* Legenda v collapsible, aby nezaberala miesto */}
            <div className="w-full">
              <details className="bg-white px-3 pb-3">
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
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 px-3 py-4 backdrop-blur supports-[backdrop-filter]:bg-white/80">
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
