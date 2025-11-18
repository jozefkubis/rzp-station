"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
} from "react";

import {
  clearRequest,
  clearShift,
  upsertRequest,
  upsertShift,
} from "@/app/_lib/actions";
import { getHolidaySetForMonth } from "@/app/_lib/holidays";
import Modal from "../Modal";
import ArrowBack from "./ArrowBack";
import ArrowForword from "./ArrowForword";
import DaysMonth from "./DaysMonth";
import { getDaysArray, MONTHS, shiftTableStats } from "./helpers_shifts";
import MainShiftsTable from "./MainShiftsTable";
import MonthYearHead from "./MonthYearHead";
import NoShifts from "./NoShifts";
import ParamedName from "./ParamedName";
import ShiftChoiceModal from "./ShiftChoiceModal";
import ShiftChoiceModalBottom from "./ShiftChoiceModalBottom";
import ShiftRow from "./ShiftRow";

import { updateMonthOrderIndex } from "@/app/_lib/actions";
import useMedia, { useMediaLarge } from "@/app/_lib/hooks/useMedia";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { toast } from "react-hot-toast";
import Print from "./Print";
import Save from "./Save";
import SaveXLSX from "./SaveXLSX";

/* ─────────────────────────────────────────────────────────────── */
export default function ShiftsTable({
  shifts,
  goTo,
  shiftsOffset,
  disabled,
  onInsertEmptyShift,
  admin,
  user,
}) {
  /* ---------- lokálne UI stavy ---------- */
  const [selected, setSelected] = useState(null); // { userId, dateStr }
  const [bottomSelected, setBottomSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);

  /* ---------- dátumové údaje ---------- */
  const base = new Date();
  const date = new Date(base.getFullYear(), base.getMonth() + shiftsOffset, 1);

  const year = date.getFullYear();
  const mIndex = date.getMonth(); // 0-based
  const month = mIndex + 1; // 1-12
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const days = getDaysArray(year, month);
  const monthName = MONTHS()[mIndex];
  const monthLabel =
    monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();
  const firstDayStr = `${year}-${String(month).padStart(2, "0")}-01`;

  /* ---------- CSS grid template ---------- */
  const isMd = useMedia();
  const isMdLarge = useMediaLarge();
  // const colTemplate = `13.5rem 2.8rem repeat(${days.length}, 2.2rem) repeat(7, 3.3rem)`;
  // const colTemplate = `12rem 2rem repeat(${days.length}, 1.8rem) repeat(7, 2.5rem)`;

  const colTemplate = useMemo(() => {
    if (isMdLarge) {
      // najväčší layout
      return `13.5rem 2.8rem repeat(${days.length}, 2.2rem) repeat(7, 3.3rem)`;
    } else if (isMd) {
      // stredný layout
      return `9rem 1.8rem repeat(${days.length}, 1.6rem) repeat(7, 2.2rem)`;
    }
    // mobil
    return `10.3rem 2rem repeat(${days.length}, 1.8rem) repeat(7, 2.5rem)`;
  }, [isMd, isMdLarge, days.length]);

  // MARK: OPTIMISTIC – hlavný reducer pre shifts
  const [optimisticShifts, applyOptimistic] = useOptimistic(
    shifts,
    (current, action) => {
      if (action.type === "ADD_USER") {
        const { user, firstDay, orderIndex } = action;
        const exists = current.some(
          (s) => s.user_id === user.user_id && s.date === firstDay,
        );
        if (exists) return current;

        const seed = {
          id: `tmp-${crypto.randomUUID()}`,
          user_id: user.user_id,
          date: firstDay,
          shift_type: null,
          request_type: null,
          request_hours: null,
          order_index: orderIndex ?? 999,
          profiles: {
            full_name: user.full_name ?? "(bez mena)",
            email: user.email ?? "",
            avatar_url: user.avatar_url ?? null,
            contract: Number(user.contract ?? 1),
            position: user.position ?? "",
          },
          __pending: true,
        };
        return [...current, seed];
      }

      if (action.type === "REMOVE_SEED") {
        const { user_id, date } = action;
        return current.filter(
          (s) => !(s.user_id === user_id && s.date === date),
        );
      }

      if (action.type === "UPSERT") {
        const exists = current.find(
          (s) => s.user_id === action.userId && s.date === action.date,
        );
        if (exists) {
          return current.map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? { ...s, shift_type: action.shift_type }
              : s,
          );
        }
        return [
          ...current,
          {
            id: `tmp-${crypto.randomUUID()}`,
            user_id: action.userId,
            date: action.date,
            shift_type: action.shift_type,
            request_type: null,
            request_hours: null,
            profiles: exists?.profiles ?? {},
          },
        ];
      }

      if (action.type === "UPSERT_REQUEST") {
        const exists = current.find(
          (s) => s.user_id === action.userId && s.date === action.date,
        );
        if (exists) {
          return current.map((s) =>
            s.user_id === action.userId && s.date === action.date
              ? {
                ...s,
                request_type: action.reqType,
                request_hours: action.hours ?? null,
              }
              : s,
          );
        }
        return [
          ...current,
          {
            id: `tmp-${crypto.randomUUID()}`,
            user_id: action.userId,
            date: action.date,
            shift_type: null,
            request_type: action.reqType,
            request_hours: action.hours ?? null,
          },
        ];
      }

      if (action.type === "CLEAR_SHIFT") {
        return current.map((s) =>
          s.user_id === action.userId && s.date === action.date
            ? { ...s, shift_type: null }
            : s,
        );
      }

      if (action.type === "DELETE_REQUEST") {
        const { userId, date } = action;
        return current.map((s) =>
          s.user_id === userId && s.date === date
            ? { ...s, request_type: null, request_hours: null }
            : s,
        );
      }

      return current;
    },
  );

  const [isPending, startTransition] = useTransition();

  // MARK: HANDLERY PICK/DELETE
  const handleTopSelect = useCallback((userId, dateStr) => {
    if (admin !== "ÁNO") return;
    setSelected({ userId, dateStr });
    setIsModalOpen(true);
  }, []);

  const handleBottomSelect = useCallback((userId, dateStr) => {
    if (admin !== "ÁNO" && user.id !== userId) return;
    setBottomSelected({ userId, dateStr });
    setIsBottomModalOpen(true);
  }, []);

  async function handlePickTop(type) {
    if (!selected) return;

    startTransition(() =>
      applyOptimistic({
        type: "UPSERT",
        userId: selected.userId,
        date: selected.dateStr,
        shift_type: type,
      }),
    );

    setIsModalOpen(false);
    await upsertShift(selected.userId, selected.dateStr, type);
  }

  async function handlePickBottom(type, hours) {
    if (!bottomSelected) return;

    startTransition(() =>
      applyOptimistic({
        type: "UPSERT_REQUEST",
        userId: bottomSelected.userId,
        date: bottomSelected.dateStr,
        reqType: type,
        hours,
      }),
    );

    setIsBottomModalOpen(false);
    await upsertRequest(
      bottomSelected.userId,
      bottomSelected.dateStr,
      type,
      hours,
    );
  }

  async function handleDeleteTop() {
    if (!selected) return;

    startTransition(() =>
      applyOptimistic({
        type: "CLEAR_SHIFT",
        userId: selected.userId,
        date: selected.dateStr,
      }),
    );

    setIsModalOpen(false);
    await clearShift(selected.userId, selected.dateStr);
  }

  async function handleDeleteBottom() {
    if (!bottomSelected) return;

    startTransition(() =>
      applyOptimistic({
        type: "DELETE_REQUEST",
        userId: bottomSelected.userId,
        date: bottomSelected.dateStr,
      }),
    );

    setIsBottomModalOpen(false);
    await clearRequest(bottomSelected.userId, bottomSelected.dateStr);
  }

  // MARK: ROSTER – len aktuálny mesiac
  const monthDatesSet = useMemo(
    () => new Set(days.map((d) => d.dateStr)),
    [days],
  );

  const roster = useMemo(() => {
    const map = new Map();
    for (const row of optimisticShifts) {
      if (!monthDatesSet.has(row.date)) continue;
      const id = row.user_id;
      const oi = row.order_index ?? 999;
      if (!map.has(id)) {
        map.set(id, {
          user_id: id,
          full_name: row.profiles?.full_name ?? "(bez mena)",
          email: row.profiles?.email ?? "(bez e-mailu)",
          avatar: row.profiles?.avatar_url,
          contract: Number(row.profiles?.contract ?? 1),
          position: row.profiles?.position,
          order_index: oi,
          __pending: row.__pending ?? false,
          shifts: [],
        });
      } else {
        const v = map.get(id);
        if (oi < (v.order_index ?? 999)) v.order_index = oi;
      }
      map.get(id).shifts.push({
        date: row.date,
        shift_type: row.shift_type,
        request_type: row.request_type,
        request_hours: row.request_hours,
      });
    }
    return Array.from(map.values()).sort(
      (a, b) => (a.order_index ?? 999) - (b.order_index ?? 999),
    );
  }, [optimisticShifts, monthDatesSet]);

  // MARK: malý reducer pre roster (len DELETE)
  const [optimisticRoster, apply] = useOptimistic(roster, (curr, act) => {
    if (act.type === "DELETE") {
      return curr.filter((u) => u.user_id !== act.id);
    }
    return curr;
  });

  // MARK: SVIATKY, NORMY
  const weekdays = days.filter(({ isWeekend }) => !isWeekend).length;
  const normHours = weekdays * 7.5;
  const holidaySet = getHolidaySetForMonth(year, month);

  // MARK: DnD
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const [rows, setRows] = useState(optimisticRoster);

  const membershipKey = useMemo(
    () => [...new Set(optimisticRoster.map((u) => u.user_id))].sort().join("|"),
    [optimisticRoster],
  );

  useEffect(() => {
    setRows(optimisticRoster);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey, membershipKey]);

  //......................................

  // MARK: EXPORT – roster do XLSX
  async function handleExportRosterXlsx() {
    // 0) Kontrola – či máme dáta
    if (!rows || rows.length === 0) {
      toast.error("Nie je čo exportovať");
      return;
    }

    // 1) Príprava dní a hlavičky
    // --------------------------------
    const dayLabels = days.map((d) => d.day);       // 1, 2, 3, ...
    const dayKeys = days.map((d) => d.dateStr);    // "YYYY-MM-DD"
    const header = ["Meno", "ÚV", ...dayLabels, "SH", "D", "N", "RD", "PN", "NČ", "PS"];

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
        contract,           // číslo – Excel s tým vie počítať
        ...topCells,        // smeny po dňoch
        ...statsValues,     // SH, D, N, RD, PN, NČ, PS
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
    sheet.addRow(header);
    dataRows.forEach((row) => {
      sheet.addRow(row);
    });

    // 5) Štýl hlavičky
    // --------------------------------
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, size: 11 };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 22;

    // 6) Šírky stĺpcov + základný font pre stĺpec Meno
    // --------------------------------
    sheet.getColumn(1).width = 27; // Meno
    sheet.getColumn(2).width = 6;  // ÚV

    for (let col = 3;col <= header.length;col++) {
      sheet.getColumn(col).width = 5; // dni + štatistiky
    }

    // Stĺpec Meno – väčšie a tučné písmo
    sheet.getColumn(1).eachCell((cell, rowNumber) => {
      // pre istotu neprepisujeme hlavičku zvlášť, tam je font už nastavený
      if (rowNumber === 1) return;
      cell.font = { size: 12, bold: true };
    });

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

    for (let rowIndex = 2;rowIndex <= sheet.rowCount;rowIndex++) {
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
      for (let r = 2;r <= sheet.rowCount;r++) {
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
    const statsEndCol = header.length;          // posledný stĺpec (PS)

    // dvojice riadkov: 2–3, 4–5, 6–7, ...
    for (let topRowIndex = 2;topRowIndex <= sheet.rowCount;topRowIndex += 2) {
      const bottomRowIndex = topRowIndex + 1;
      if (bottomRowIndex > sheet.rowCount) break; // pre istotu

      // Spojiť MENO (stĺpec 1)
      sheet.mergeCells(topRowIndex, 1, bottomRowIndex, 1);

      // Spojiť všetky štatistické stĺpce
      for (let col = statsStartCol;col <= statsEndCol;col++) {
        sheet.mergeCells(topRowIndex, col, bottomRowIndex, col);
      }

      // Zarovnanie spojených buniek
      const topRow = sheet.getRow(topRowIndex);
      topRow.getCell(1).alignment = {
        vertical: "middle",
        horizontal: "left",
      };

      for (let col = statsStartCol;col <= statsEndCol;col++) {
        topRow.getCell(col).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
      }
    }

    // 11) Vygenerovanie .xlsx do bufferu a stiahnutie
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

  //......................................

  // MARK: EXPORT – roster do CSV (Excel)
  function handleExportRosterCsv() {
    if (!rows || rows.length === 0) {
      toast.error("Nie je čo exportovať");
      return;
    }

    // 1) Dni v mesiaci
    const dayLabels = days.map((d) => d.day);    // 1, 2, 3...
    const dayKeys = days.map((d) => d.dateStr);  // "YYYY-MM-DD"

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
        String(contract).replace(".", ","),   // 1 → "1", 0.5 → "0,5"
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
        "",          // meno necháme prázdne, bude to vyzerať ako spodný riadok
        "",          // úväzok tiež prázdny
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
  //......................................

  const itemIds = rows.map((u) => `${monthKey}:${u.user_id}`);

  async function handleDragEnd(event) {
    const { active, over } = event || {};
    if (!over || active?.id === over?.id) return;

    const activeUserId = String(active.id).split(":").pop();
    const overUserId = String(over.id).split(":").pop();
    const oldIndex = rows.findIndex((r) => r.user_id === activeUserId);
    const newIndex = rows.findIndex((r) => r.user_id === overUserId);
    if (oldIndex < 0 || newIndex < 0) return;

    // optimistic move
    const next = arrayMove(rows, oldIndex, newIndex);
    setRows(next);

    try {
      await updateMonthOrderIndex(
        shiftsOffset,
        next.map((m, idx) => ({ user_id: m.user_id, order_index: idx + 1 })),
      );
    } catch (e) {
      console.error(e);
      setRows((prev) => arrayMove(prev, newIndex, oldIndex));
      toast.error("Nepodarilo sa uložiť poradie");
    }
  }

  // MARK: optimistic ADD handler
  async function handleInsertEmptyShift(newUser) {
    const nextIndex = (rows?.length ?? 0) + 1;

    // optimistic add
    applyOptimistic({
      type: "ADD_USER",
      user: {
        user_id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        avatar_url: newUser.avatar_url,
        contract: newUser.contract,
        position: newUser.position,
      },
      firstDay: firstDayStr,
      orderIndex: nextIndex,
    });

    setRows((prev) => [
      ...prev,
      {
        user_id: newUser.id,
        full_name: newUser.full_name ?? "(bez mena)",
        email: newUser.email ?? "",
        avatar: newUser.avatar_url ?? null,
        contract: Number(newUser.contract ?? 1),
        position: newUser.position ?? "",
        order_index: nextIndex,
        __pending: true,
        shifts: [
          {
            date: firstDayStr,
            shift_type: null,
            request_type: null,
            request_hours: null,
          },
        ],
      },
    ]);

    try {
      await onInsertEmptyShift(newUser);
    } catch (e) {
      console.error(e);
      // rollback
      setRows((prev) => prev.filter((r) => r.user_id !== newUser.id));
      applyOptimistic({
        type: "REMOVE_SEED",
        user_id: newUser.id,
        date: firstDayStr,
      });
    }
  }

  // MARK: RENDER
  return (
    <>
      <MainShiftsTable colTemplate={colTemplate}>
        <div className="absolute top-10 right-4 flex gap-1 no-print">
          <Save onExport={handleExportRosterCsv} />
          <SaveXLSX onXlsx={handleExportRosterXlsx} />
          <Print />
        </div>
        <MonthYearHead>
          <ArrowBack
            goTo={goTo}
            shiftsOffset={shiftsOffset}
            disabled={disabled}
          />
          <div>
            {monthLabel} {year} - Norma hodín: {normHours}
          </div>
          <ArrowForword
            goTo={goTo}
            shiftsOffset={shiftsOffset}
            disabled={disabled}
          />
        </MonthYearHead>

        <div
          className="sticky top-0 z-30 grid border-r border-t border-slate-200"
          style={{ gridTemplateColumns: colTemplate }}
        >
          <ParamedName>Záchranári</ParamedName>
          <DaysMonth>ÚV</DaysMonth>

          {days.map(({ day, isWeekend, isToday }, idx) => {
            const yyyy = String(year);
            const mm = String(month).padStart(2, "0");
            const dd = String(day).padStart(2, "0");
            const dateStr = `${yyyy}-${mm}-${dd}`;
            const isHoliday = holidaySet.has(dateStr);

            const headBg = isToday
              ? "bg-primary-100 font-semibold"
              : isHoliday
                ? "bg-holiday"
                : isWeekend
                  ? "bg-amber-100"
                  : "bg-white";

            return (
              <DaysMonth key={idx} headBg={headBg}>
                {day}
              </DaysMonth>
            );
          })}

          {shiftTableStats(0).map((col) => (
            <DaysMonth key={col.key}>{col.label}</DaysMonth>
          ))}
        </div>

        {shifts.length === 0 ? (
          <NoShifts />
        ) : (
          <DndContext
            key={monthKey}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={itemIds}
              strategy={verticalListSortingStrategy}
            >
              {rows.map((p, idx) => {
                const fresh =
                  optimisticRoster.find((u) => u.user_id === p.user_id) || p;

                const position = String(fresh.position ?? "");
                const contract = Number(fresh.contract ?? 1);
                const perUserNorm = Math.round(normHours * contract * 10) / 10;
                const rowShiftStats = shiftTableStats(perUserNorm, contract);

                return (
                  <ShiftRow
                    key={`${monthKey}:${p.user_id}`}
                    user={fresh}
                    onDeleteOptimistic={(id) => apply({ type: "DELETE", id })}
                    days={days}
                    colTemplate={colTemplate}
                    onTopSelect={handleTopSelect}
                    onBottomSelect={handleBottomSelect}
                    rowBg={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    roster={rows}
                    shiftStats={rowShiftStats}
                    normHours={perUserNorm}
                    contract={contract}
                    position={position}
                    holidaySet={holidaySet}
                    monthKey={monthKey}
                    admin={admin}
                  />
                );
              })}
            </SortableContext>
          </DndContext>
        )}
      </MainShiftsTable>

      {/* modals */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ShiftChoiceModal
            onPickTop={handlePickTop}
            onDeleteTop={handleDeleteTop}
            disabled={isPending}
          />
        </Modal>
      )}

      {isBottomModalOpen && (
        <Modal onClose={() => setIsBottomModalOpen(false)}>
          <ShiftChoiceModalBottom
            onPickBottom={handlePickBottom}
            onDeleteBottom={handleDeleteBottom}
            disabled={isPending}
          />
        </Modal>
      )}
    </>
  );
}
