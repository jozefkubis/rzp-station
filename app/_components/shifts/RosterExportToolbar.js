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
  // CSV export
  function handleCsv() {
    exportRosterToCsv({ rows, days, monthKey });
  }

  // XLSX export
  async function handleXlsx() {
    await exportRosterToXlsx({
      rows,
      days,
      monthKey,
      monthLabel,
      year,
      normHours,
    });
  }

  return (
    <div className="no-print flex justify-start gap-1 pt-3 md:pt-4 lg:justify-end">
      <ShareButton
        monthLabel={monthLabel}
        year={year}
        stationName={stationName}
        title="Rozpis služieb"
      />
      <SaveCSV onCsv={handleCsv} />
      <SaveXLSX onXlsx={handleXlsx} />
      <PrintButton />
    </div>
  );
}
