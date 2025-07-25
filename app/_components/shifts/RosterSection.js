"use client";

import { useRouter } from "next/navigation";
import { useOptimistic } from "react";
import DeleteAllShifts from "./DeleteAllShifts";
import InsertShiftButton from "./InsertShiftButton";
import ShiftsTable from "./ShiftsTable";

/**
 * RosterSection drží optimistický stav pre celú tabuľku.
 * Props:
 *   - initialShifts  : pole shiftov získané na serveri
 *   - diffProfiles   : voľní záchranári (pole { id, full_name })
 */
export default function RosterSection({ initialShifts, diffProfiles, initialShiftsOffset }) {
  const router = useRouter();

  // useEffect(() => {
  //   if (typeof window !== "undefined") {
  //     sessionStorage.setItem("shiftOffset", String(initialShiftsOffset));
  //   }
  // }, [initialShiftsOffset]);


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
            id: `tmp-${Date.now()}`, // len kľúč pre React
            user_id: act.userId,
            date: act.date, // YYYY-MM-DD (prvý deň mesiaca)
            shift_type: null,
            profiles: {
              full_name: act.full_name,
            },
          },
        ];
      }
      return curr;
    },
  );

  /* 🟡 2) callback, ktorý odovzdáme InsertShiftButtonu */
  function handleInsertEmptyShift({ userId, full_name }) {
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
    });
  }

  function goTo(offset) {
    router.push(`/shifts?m=${offset}`);
  }

  /* 🟡 3) UI – tabuľka + tlačidlo */
  return (
    <div className="flex w-[100%] flex-col">
      {/* 1️⃣ centrovaná tabuľka s maximálnou šírkou kontajnera */}
      <div className="flex justify-center px-8">
        <div className="max-w-full overflow-x-auto">
          <ShiftsTable shifts={optimShifts} goTo={goTo} shiftsOffset={initialShiftsOffset} />
        </div>
      </div>

      {/* 2️⃣ tlačidlá pod tabuľkou – zostaňme pri rovnakom odsadení */}
      <div className="mt-6 flex gap-2 self-start px-8 2xl:px-36">
        <DeleteAllShifts />
        <InsertShiftButton
          profiles={diffProfiles}
          onInsertEmptyShift={handleInsertEmptyShift}
        />
      </div>
    </div>
  );
}
