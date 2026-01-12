import { toast } from "react-hot-toast";
import { shiftTableStats } from "../_components/shifts/helpers_shifts";

// MARK: EXPORT – roster do svojho kalendára
// YYYYMMDD pre all-day event
function yyyymmdd(dateStr) {
  return String(dateStr).slice(0, 10).replaceAll("-", "");
}

function icsEscape(s) {
  return String(s ?? "")
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
}

function uid(prefix = "rzp") {
  return `${prefix}-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

/**
 * myShifts: [{ date: "YYYY-MM-DD", shift_type: "D" | "N" | "RD" | ... }]
 */
export function exportMyShiftsToIcsSimple({
  myShifts,
  monthKey,
  stationName = "RZP",
}) {
  if (!Array.isArray(myShifts) || myShifts.length === 0) {
    toast.error("Nie je čo exportovať");
    return;
  }

  const monthPrefix = `${monthKey}-`;
  const shifts = myShifts
    .filter((s) => String(s.date).startsWith(monthPrefix))
    .filter((s) => s.shift_type);

  if (!shifts.length) {
    toast.error("V tomto mesiaci nemáš žiadne služby");
    return;
  }

  const lines = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//RZP Station//My Shifts//SK");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");

  for (const s of shifts) {
    const dateStr = String(s.date).slice(0, 10);
    const dtStart = yyyymmdd(dateStr);

    // dtEnd = ďalší deň (all-day event končí exkluzívne)
    const d = new Date(dateStr + "T00:00:00");
    d.setDate(d.getDate() + 1);
    const endStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(d.getDate()).padStart(2, "0")}`;
    const dtEnd = yyyymmdd(endStr);

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid("shift")}`);
    lines.push(
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    );
    lines.push(`SUMMARY:${icsEscape(s.shift_type)}`);
    lines.push(`DTSTART;VALUE=DATE:${dtStart}`);
    lines.push(`DTEND;VALUE=DATE:${dtEnd}`);
    lines.push(
      `DESCRIPTION:${icsEscape(`Služba: ${s.shift_type} (${stationName})`)}`,
    );
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");

  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);

  const fileName = `my-shifts-${monthKey}.ics`;
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  toast.success("Kalendár (.ics) exportovaný");
}

// MARK: EXPORT – roster do CSV (Excel)
export function exportRosterToCsv({ rows, days, monthKey }) {
  if (!rows || rows.length === 0) {
    toast.error("Nie je čo exportovať");
    return;
  }

  // 1) Dni v mesiaci
  const dayLabels = days.map((d) => d.day); // 1, 2, 3...
  const dayKeys = days.map((d) => d.dateStr); // "YYYY-MM-DD"

  // 2) Hlavička – pridáme stĺpec "Riadok" (Smena/Požiadavka)
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

      // napr. "PN" alebo "PN 4h"
      if (s.request_hours != null) {
        return `${s.request_hours}h`;
      }
      return s.request_type;
    });

    dataRows.push([
      "", // meno necháme prázdne, bude to vyzerať ako spodný riadok
      "", // úväzok tiež prázdny
      // "Požiadavka",
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
export async function exportRosterToXlsx({
  rows,
  days,
  monthKey,
  monthLabel,
  year,
  normHours,
}) {
  // 0) Kontrola – či máme dáta
  if (!rows || rows.length === 0) {
    toast.error("Nie je čo exportovať");
    return;
  }

  // 1) Príprava dní a hlavičky
  // --------------------------------
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
  // --------------------------------
  rows.forEach((row) => {
    const contract = Number(row.contract ?? 1);
    const perUserNorm = Math.round(normHours * contract * 10) / 10;

    // Štatistiky: dostaneme definície (key, label, calc)
    const statsDefs = shiftTableStats(perUserNorm, contract);

    // Čísla pre jednotlivé stĺpce štatistík [SH, D, N, RD, PN, NČ, PS]
    const statsValues = statsDefs.map((def) => def.calc(row.shifts ?? []));

    // Map dátum -> smena (pre rýchle lookup-y)
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
      ...topCells, // smeny po dňoch
      ...statsValues, // SH, D, N, RD, PN, NČ, PS
    ]);

    // --- Dolný riadok: POŽIADAVKA ---
    const bottomCells = dayKeys.map((dateStr) => {
      const s = shiftsByDate.get(dateStr);
      if (!s || !s.request_type) return "";

      if (s.request_hours != null) {
        return `${s.request_hours}h`; // napr. "4h"
      }
      return s.request_type; // napr. "PN"
    });

    dataRows.push([
      "", // meno prázdne → vizuálne patrí k riadku nad tým
      "", // úväzok prázdny
      ...bottomCells,
      ...new Array(statsDefs.length).fill(""), // prázdne bunky pre štatistiky
    ]);
  });

  // 3) ExcelJS – workbook a sheet
  // --------------------------------
  const ExcelJS = await import("exceljs");
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(`Rozpis ${monthKey}`);

  // 4) Zápis hlavičky a dát
  // --------------------------------
  // 4) Titulok + zápis hlavičky a dát
  // --------------------------------

  // 4A) Titulný riadok – mesiac hore nad tabuľkou
  // tu predpokladám, že vo funkcii máš k dispozícii `monthLabel` (napr. "November 2025")
  // ak nie, môžeš dočasne použiť monthKey
  const titleText = `Rozpis služieb - ${monthLabel ?? monthKey} ${year}`;

  // riadok 1: titulok
  const titleRow = sheet.addRow([titleText]);
  // spojíme bunky od 1 po posledný stĺpec hlavičky
  sheet.mergeCells(1, 1, 1, header.length);

  // štýl titulku
  titleRow.font = { bold: true, size: 14 };
  titleRow.alignment = { vertical: "middle", horizontal: "center" };
  titleRow.height = 26;

  // 4B) riadok 2: hlavička tabuľky
  sheet.addRow(header);

  // 4C) dátové riadky začínajú od riadku 3
  dataRows.forEach((row) => {
    sheet.addRow(row);
  });

  // 5) Štýl hlavičky
  // --------------------------------
  const headerRow = sheet.getRow(2);
  headerRow.font = { size: 11 };
  headerRow.alignment = { vertical: "middle", horizontal: "center" };
  headerRow.height = 22;

  // 6) Šírky stĺpcov + základný font pre stĺpec Meno
  // --------------------------------
  sheet.getColumn(1).width = 27; // Meno
  sheet.getCell(2, 1).font = { size: 11, bold: true };
  sheet.getColumn(2).width = 5; // ÚV

  for (let col = 3; col <= header.length; col++) {
    sheet.getColumn(col).width = 4; // dni + štatistiky
  }

  // 7) Zvýraznenie víkendov v HLAVIČKE
  // --------------------------------
  days.forEach((d, idx) => {
    const col = idx + 3; // 1=Meno, 2=ÚV, 3=prvý deň
    const cell = headerRow.getCell(col);

    if (d.isWeekend) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEF3C7" }, // jemná „amber“ farba
      };
    }
  });

  // 8) Základné zarovnanie riadkov + farby podľa typu smeny
  // --------------------------------
  const colorMap = {
    RD: "FF22C55E", // zelená (Tailwind green-500 s pridaným FF na začiatok)
  };

  for (let rowIndex = 3; rowIndex <= sheet.rowCount; rowIndex++) {
    const row = sheet.getRow(rowIndex);

    // Zarovnanie celého riadku – center, okrem mena
    row.alignment = { vertical: "middle", horizontal: "center" };
    row.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "left",
    };
    row.height = 22;

    // Farbičky podľa typu smeny (D/N/RD/PN...)
    days.forEach((d, dayIdx) => {
      const col = dayIdx + 3;
      const cell = row.getCell(col);
      const value = cell.value; // D/N/RD/...

      if (colorMap[value]) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: colorMap[value] },
        };
      }
    });
  }

  // 9) Zvýraznenie víkendov v DÁTACH (podfarbenie celého stĺpca víkendových dní)
  // --------------------------------
  days.forEach((d, dayIdx) => {
    if (!d.isWeekend) return;

    const col = dayIdx + 3;
    for (let r = 3; r <= sheet.rowCount; r++) {
      const cell = sheet.getRow(r).getCell(col);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFEF3C7" }, // rovnaká farba ako v hlavičke
      };
    }
  });

  // 10) Spojenie buniek – Meno + štatistiky cez horný/dolný riadok
  // --------------------------------
  const statsStartCol = 3 + dayLabels.length; // prvý stĺpec štatistiky (SH)
  const statsEndCol = header.length; // posledný stĺpec (PS)

  // dvojice riadkov: 3–4, 5–6, 7–8...
  for (let topRowIndex = 3; topRowIndex <= sheet.rowCount; topRowIndex += 2) {
    const bottomRowIndex = topRowIndex + 1;
    if (bottomRowIndex > sheet.rowCount) break;

    // 1) Spojiť MENO (stĺpec 1)
    sheet.mergeCells(topRowIndex, 1, bottomRowIndex, 1);

    // 2) Spojiť ÚV (stĺpec 2)
    sheet.mergeCells(topRowIndex, 2, bottomRowIndex, 2);

    // 3) Spojiť všetky štatistiky (každý stĺpec zvlášť)
    for (let col = statsStartCol; col <= statsEndCol; col++) {
      sheet.mergeCells(topRowIndex, col, bottomRowIndex, col);
      sheet.getColumn(col).width = 6;
    }

    // 4) Zarovnanie spojených buniek v hornom riadku
    const topRow = sheet.getRow(topRowIndex);

    // Meno – vľavo
    topRow.getCell(1).alignment = {
      vertical: "middle",
      horizontal: "left",
    };

    // ÚV – v strede
    topRow.getCell(2).alignment = {
      vertical: "middle",
      horizontal: "center",
    };

    // Štatistiky – v strede
    for (let col = statsStartCol; col <= statsEndCol; col++) {
      topRow.getCell(col).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    }
  }

  // 11) Bordery – mriežka + vonkajší rám
  // --------------------------------
  const lastRow = sheet.rowCount;
  const lastCol = header.length;

  // Tenká mriežka pre celú tabuľku (okrem titulku v riadku 1)
  for (let r = 2; r <= lastRow; r++) {
    const row = sheet.getRow(r);
    for (let c = 1; c <= lastCol; c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: "thin", color: { argb: "FFE5E7EB" } }, // svetlá sivá
        left: { style: "thin", color: { argb: "FFE5E7EB" } },
        bottom: { style: "thin", color: { argb: "FFE5E7EB" } },
        right: { style: "thin", color: { argb: "FFE5E7EB" } },
      };
    }
  }

  // Hrubší rám okolo celej tabuľky (hlavička + dáta, bez titulku)
  const tableTop = 2; // hlavička
  const tableBottom = lastRow; // posledný riadok
  const tableLeft = 1; // "Meno"
  const tableRight = lastCol; // posledný stĺpec (PS)

  // Horná hrana rámu
  const topRow = sheet.getRow(tableTop);
  for (let c = tableLeft; c <= tableRight; c++) {
    const cell = topRow.getCell(c);
    cell.border = {
      ...cell.border,
      top: { style: "medium", color: { argb: "FF9CA3AF" } }, // trochu výraznejšia sivá
    };
  }

  // Dolná hrana rámu
  const bottomRow = sheet.getRow(tableBottom);
  for (let c = tableLeft; c <= tableRight; c++) {
    const cell = bottomRow.getCell(c);
    cell.border = {
      ...cell.border,
      bottom: { style: "medium", color: { argb: "FF9CA3AF" } },
    };
  }

  // Ľavá hrana rámu
  for (let r = tableTop; r <= tableBottom; r++) {
    const cell = sheet.getRow(r).getCell(tableLeft);
    cell.border = {
      ...cell.border,
      left: { style: "medium", color: { argb: "FF9CA3AF" } },
    };
  }

  // Pravá hrana rámu
  for (let r = tableTop; r <= tableBottom; r++) {
    const cell = sheet.getRow(r).getCell(tableRight);
    cell.border = {
      ...cell.border,
      right: { style: "medium", color: { argb: "FF9CA3AF" } },
    };
  }

  // (voliteľné) zvislý hrubší oddelovač pred štatistikami
  const statsStartColSepar = 3 + dayLabels.length; // už ho aj tak počítaš nižšie
  for (let r = tableTop; r <= tableBottom; r++) {
    const cell = sheet.getRow(r).getCell(statsStartColSepar);
    cell.border = {
      ...cell.border,
      left: { style: "medium", color: { argb: "FF9CA3AF" } },
    };
  }

  // 12) Vygenerovanie .xlsx do bufferu a stiahnutie
  // --------------------------------
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
