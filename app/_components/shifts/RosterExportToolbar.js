// app/_components/shifts/RosterExportToolbar.js
"use client";

import { exportRosterToCsv, exportRosterToXlsx } from "@/app/_lib/rosterExport";
import PrintButton from "./PrintButton";
import SaveCSV from "./SaveCSV";
import SaveXLSX from "./SaveXLSX";
import ShareButton from "./ShareButton";

export default function RosterExportToolbar({
  rows,
  days,
  monthKey,
  monthLabel,
  year,
  normHours,
  stationName = "RZP Rajec",
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

  return (
    <div className="no-print flex justify-end gap-1 pt-3 md:pt-4">
      <ShareButton
        monthLabel={monthLabel}
        year={year}
        stationName={stationName}
        title="Rozpis služieb"
      />
      <SaveCSV onCsv={handleExportRosterToCsv} />
      <SaveXLSX onXlsx={handleExportRosterToXlsx} />
      <PrintButton />
    </div>
  );
}
