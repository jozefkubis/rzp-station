// app/_components/shifts/RosterExportToolbar.js
"use client";

import { toast } from "react-hot-toast";
import { shiftTableStats } from "./helpers_shifts";
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
    if (!rows || rows.length === 0) {
      toast.error("Nie je čo exportovať");
      return;
    }

    // 1) Dni v mesiaci
    const dayLabels = days.map((d) => d.day); // 1, 2, 3...
    const dayKeys = days.map((d) => d.dateStr); // "YYYY-MM-DD"

    // 2) Hlavička
    const header = ["Meno", "ÚV", ...dayLabels];
    const dataRows = [];

    // 3) Pre každého záchranára spravíme DVA riadky
    rows.forEach((row) => {
      const contract = Number(row.contract ?? 1);

      const shiftsByDate = new Map();
      row.shifts?.forEach((s) => {
        shiftsByDate.set(s.date, s);
      });

      // --- horný riadok: SMENA ---
      const topCells = dayKeys.map((dateStr) => {
        const s = shiftsByDate.get(dateStr);
        return s?.shift_type ?? "";
      });

      dataRows.push([
        row.full_name ?? "",
        String(contract).replace(".", ","), // 1 → "1", 0.5 → "0,5"
        ...topCells,
      ]);

      // --- dolný riadok: POŽIADAVKA ---
      const bottomCells = dayKeys.map((dateStr) => {
        const s = shiftsByDate.get(dateStr);
        if (!s || !s.request_type) return "";

        if (s.request_hours != null) {
          return `${s.request_hours}h`; // napr. "4h"
        }
        return s.request_type; // napr. "PN"
      });

      dataRows.push([
        "", // meno necháme prázdne, bude to vyzerať ako spodný riadok
        "", // úväzok tiež prázdny
        ...bottomCells,
      ]);
    });

    // 4) Escapovanie buniek
    const escapeCell = (value) => {
      const str = String(value ?? "");
      if (/[;"\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // 5) CSV text
    const csvRows = [header, ...dataRows]
      .map((row) => row.map(escapeCell).join(";"))
      .join("\n");

    // 6) Blob s BOM kvôli diakritike v Exceli
    const blob = new Blob(["\uFEFF" + csvRows], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const fileName = `roster-${monthKey}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // MARK: EXPORT – roster do XLSX
  async function handleExportRosterToXlsx() {
    // 0) Kontrola – či máme dáta
    if (!rows || rows.length === 0) {
      toast.error("Nie je čo exportovať");
      return;
    }

    // 1) Príprava dní a hlavičky
    const dayLabels = days.map((d) => d.day); // 1, 2, 3, ...
    const dayKeys = days.map((d) => d.dateStr); // "YYYY-MM-DD"
    const header = [
      "Meno",
      "ÚV",
      ...dayLabels,
      "SH",
      "D",
      "N",
      "RD",
      "PN",
      "NČ",
      "PS",
    ];

    const dataRows = [];

    // 2) Príprava dát – pre každého záchranára dva riadky (SMENY + POŽIADAVKY)
    rows.forEach((row) => {
      const contract = Number(row.contract ?? 1);
      const perUserNorm = Math.round(normHours * contract * 10) / 10;

      // Štatistiky
      const statsDefs = shiftTableStats(perUserNorm, contract);
      const statsValues = statsDefs.map((def) => def.calc(row.shifts ?? []));

      const shiftsByDate = new Map();
      row.shifts?.forEach((s) => {
        shiftsByDate.set(s.date, s);
      });

      // --- Horný riadok: SMENA ---
      const topCells = dayKeys.map((dateStr) => {
        const s = shiftsByDate.get(dateStr);
        return s?.shift_type ?? "";
      });

      dataRows.push([
        row.full_name ?? "",
        contract, // číslo – Excel s tým vie počítať
        ...topCells,
        ...statsValues, // SH, D, N, RD, PN, NČ, PS
      ]);

      // --- Dolný riadok: POŽIADAVKA ---
      const bottomCells = dayKeys.map((dateStr) => {
        const s = shiftsByDate.get(dateStr);
        if (!s || !s.request_type) return "";

        if (s.request_hours != null) {
          return `${s.request_hours}h`;
        }
        return s.request_type;
      });

      dataRows.push([
        "", // meno prázdne → vizuálne patrí k riadku nad tým
        "", // úväzok prázdny
        ...bottomCells,
        ...new Array(statsDefs.length).fill(""),
      ]);
    });

    // 3) ExcelJS – workbook a sheet
    const ExcelJS = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Rozpis ${monthKey}`);

    // 4) Titulok + hlavička + dáta
    const titleText = `Rozpis služieb - ${monthLabel ?? monthKey} ${year}`;

    const titleRow = sheet.addRow([titleText]);
    sheet.mergeCells(1, 1, 1, header.length);
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { vertical: "middle", horizontal: "center" };
    titleRow.height = 26;

    sheet.addRow(header);
    dataRows.forEach((row) => sheet.addRow(row));

    // 5) Štýl hlavičky
    const headerRow = sheet.getRow(2);
    headerRow.font = { size: 11 };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 22;

    // 6) Šírky stĺpcov + font pre Meno
    sheet.getColumn(1).width = 27; // Meno
    sheet.getCell(2, 1).font = { size: 11, bold: true };
    sheet.getColumn(2).width = 5; // ÚV

    for (let col = 3; col <= header.length; col++) {
      sheet.getColumn(col).width = 4; // dni + štatistiky
    }

    // 7) Zvýraznenie víkendov v HLAVIČKE
    days.forEach((d, idx) => {
      const col = idx + 3; // 1=Meno, 2=ÚV, 3=prvý deň
      const cell = headerRow.getCell(col);

      if (d.isWeekend) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEF3C7" }, // jemná amber
        };
      }
    });

    // 8) Zarovnanie riadkov + farby podľa typu smeny
    const colorMap = {
      RD: "FF22C55E", // zelená
    };

    for (let rowIndex = 3; rowIndex <= sheet.rowCount; rowIndex++) {
      const row = sheet.getRow(rowIndex);

      row.alignment = { vertical: "middle", horizontal: "center" };
      row.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "left",
      };
      row.height = 22;

      days.forEach((d, dayIdx) => {
        const col = dayIdx + 3;
        const cell = row.getCell(col);
        const value = cell.value;

        if (colorMap[value]) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: colorMap[value] },
          };
        }
      });
    }

    // 9) Podfarbenie víkendových stĺpcov v dátach
    days.forEach((d, dayIdx) => {
      if (!d.isWeekend) return;

      const col = dayIdx + 3;
      for (let r = 3; r <= sheet.rowCount; r++) {
        const cell = sheet.getRow(r).getCell(col);
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEF3C7" },
        };
      }
    });

    // 10) Spojenie buniek – Meno, ÚV, štatistiky
    const statsStartCol = 3 + dayLabels.length;
    const statsEndCol = header.length;

    for (let topRowIndex = 3; topRowIndex <= sheet.rowCount; topRowIndex += 2) {
      const bottomRowIndex = topRowIndex + 1;
      if (bottomRowIndex > sheet.rowCount) break;

      sheet.mergeCells(topRowIndex, 1, bottomRowIndex, 1); // MENO
      sheet.mergeCells(topRowIndex, 2, bottomRowIndex, 2); // ÚV

      for (let col = statsStartCol; col <= statsEndCol; col++) {
        sheet.mergeCells(topRowIndex, col, bottomRowIndex, col);
        sheet.getColumn(col).width = 6;
      }

      const topRow = sheet.getRow(topRowIndex);

      topRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "left",
      };

      topRow.getCell(2).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      for (let col = statsStartCol; col <= statsEndCol; col++) {
        topRow.getCell(col).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
    }

    // 11) Bordery – mriežka + vonkajší rám
    const lastRow = sheet.rowCount;
    const lastCol = header.length;

    for (let r = 2; r <= lastRow; r++) {
      const row = sheet.getRow(r);
      for (let c = 1; c <= lastCol; c++) {
        const cell = row.getCell(c);
        cell.border = {
          top: { style: "thin", color: { argb: "FFE5E7EB" } },
          left: { style: "thin", color: { argb: "FFE5E7EB" } },
          bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
          right: { style: "thin", color: { argb: "FFE5E7EB" } },
        };
      }
    }

    const tableTop = 2;
    const tableBottom = lastRow;
    const tableLeft = 1;
    const tableRight = lastCol;

    // Horná hrana
    const topRow2 = sheet.getRow(tableTop);
    for (let c = tableLeft; c <= tableRight; c++) {
      const cell = topRow2.getCell(c);
      cell.border = {
        ...cell.border,
        top: { style: "medium", color: { argb: "FF9CA3AF" } },
      };
    }

    // Dolná hrana
    const bottomRow = sheet.getRow(tableBottom);
    for (let c = tableLeft; c <= tableRight; c++) {
      const cell = bottomRow.getCell(c);
      cell.border = {
        ...cell.border,
        bottom: { style: "medium", color: { argb: "FF9CA3AF" } },
      };
    }

    // Ľavá hrana
    for (let r = tableTop; r <= tableBottom; r++) {
      const cell = sheet.getRow(r).getCell(tableLeft);
      cell.border = {
        ...cell.border,
        left: { style: "medium", color: { argb: "FF9CA3AF" } },
      };
    }

    // Pravá hrana
    for (let r = tableTop; r <= tableBottom; r++) {
      const cell = sheet.getRow(r).getCell(tableRight);
      cell.border = {
        ...cell.border,
        right: { style: "medium", color: { argb: "FF9CA3AF" } },
      };
    }

    // Oddelovač pred štatistikami
    const statsStartColSepar = 3 + dayLabels.length;
    for (let r = tableTop; r <= tableBottom; r++) {
      const cell = sheet.getRow(r).getCell(statsStartColSepar);
      cell.border = {
        ...cell.border,
        left: { style: "medium", color: { argb: "FF9CA3AF" } },
      };
    }

    // 12) Vygenerovanie .xlsx do bufferu a stiahnutie
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `roster-${monthKey}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="no-print flex justify-start gap-1 pt-3 md:pt-4 lg:justify-end">
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
