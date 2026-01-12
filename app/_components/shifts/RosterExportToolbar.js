"use client";

import {
  exportMyShiftsToIcsSimple,
  exportRosterToCsv,
  exportRosterToXlsx,
} from "@/app/_lib/rosterExport";
import toast from "react-hot-toast";
import PrintButton from "./PrintButton";
import SaveCSV from "./SaveCSV";
import SaveXLSX from "./SaveXLSX";
import SaveYourCalendar from "./SaveYourCalendar";
import ShareButton from "./ShareButton";

export default function RosterExportToolbar({
  rows,
  days,
  monthKey,
  monthLabel,
  year,
  normHours,
  stationName = "RZP Rajec",
  userId,
}) {
  // MARK: EXPORT – roster do CSV (Excel)
  function handleExportRosterToCsv() {
    exportRosterToCsv({ rows, days, monthKey });
  }

  // MARK: EXPORT – roster do XLSX
  function handleExportRosterToXlsx() {
    exportRosterToXlsx({
      rows,
      days,
      monthKey,
      monthLabel,
      year,
      normHours,
    });
  }

  // ✅ už bez parametrov – berie priamo z props (najmenej chýb)
  function handleExportRosterToYourCalendar() {
    if (!userId) return;
    if (!rows?.length) return;

    const myRow =
      rows.find((r) => r.id === userId) ||
      rows.find((r) => r.profile_id === userId) ||
      rows.find((r) => r.user_id === userId);

    if (!myRow) {
      toast.error("Nenašiel som tvoje služby v rostri");
      return;
    }

    const myShifts = (myRow.shifts ?? []).map((s) => ({
      date: s.date,
      shift_type: s.shift_type,
    }));

    exportMyShiftsToIcsSimple({ myShifts, monthKey, stationName });
  }

  return (
    <div className="no-print flex justify-end gap-1 pt-3 md:pt-4">
      <div title="Uložiť rozpis do Excelu (XLSX)">
        <SaveXLSX onXlsx={handleExportRosterToXlsx} />
      </div>

      <div title="Uložiť rozpis do CSV">
        <SaveCSV onCsv={handleExportRosterToCsv} />
      </div>

      <div title="Uložiť moje služby do osobného kalendára (iCal)">
        <SaveYourCalendar onYourCalendar={handleExportRosterToYourCalendar} />
      </div>

      <div title="Zdieľať rozpis služieb">
        <ShareButton
          monthLabel={monthLabel}
          year={year}
          stationName={stationName}
          title="Rozpis služieb"
        />
      </div>

      <div title="Vytlačiť rozpis služieb">
        <PrintButton />
      </div>
    </div>
  );
}
