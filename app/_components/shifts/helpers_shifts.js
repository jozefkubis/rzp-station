// helpers_shifts.js
//--------------------------------------------------------------
// 1️⃣ Počet dní v mesiaci
export function getDayCount(year, month) {
  return new Date(year, month, 0).getDate();
}

// 2️⃣ Pole objektov pre každý deň mesiaca
export function getDaysArray(year, month) {
  const total = getDayCount(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: total }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    date.setHours(0, 0, 0, 0);
    const weekday = date.getDay(); // 0 = nedeľa

    return {
      day: i + 1,
      dateStr: date.toLocaleDateString("sv-SE"), // "YYYY-MM-DD"
      isWeekend: weekday === 0 || weekday === 6,
      isToday: date.getTime() === today.getTime(),
    };
  });
}

// 3️⃣ Lokalizované názvy mesiacov
export function MONTHS() {
  return [
    "január",
    "február",
    "marec",
    "apríl",
    "máj",
    "jún",
    "júl",
    "august",
    "september",
    "október",
    "november",
    "december",
  ];
}

//──────────────────────────────────────────────────────────────
// KONŠTANTY PRE ŠTATISTIKU

// ⌛ Trvanie smien v hodinách
export const HOURS = {
  D: 12,
  N: 12,
  vD: 12,
  zD: 12,
  vN: 12,
  zN: 12,
  DN: 24,
  ND: 24,
  RD: 7.5, // dovolenka
  PN: 7.5,
};

// 🗂 Zoskupenia typov
const DAY_SET = new Set(["D", "vD", "zD", "DN", "ND"]);
const NIGHT_SET = new Set(["N", "vN", "zN", "DN", "ND"]);
const HOLIDAY = "RD";
const SICKDAY = "PN";

// 📊 Jednotky služby pre stĺpec PS
const UNITS = {
  D: 1,
  vD: 1,
  zD: 1,
  N: 1,
  vN: 1,
  zN: 1,
  DN: 2,
  ND: 2,
  RD: 0,
  PN: 0,
};

//──────────────────────────────────────────────────────────────
// Hodiny z požiadavky (spodný riadok)
function reqHours(s) {
  // 1) ak z modálu prišlo číslo               (request_hours)
  if (s.request_hours != null) {
    const n = Number(s.request_hours);
    return isNaN(n) ? 0 : n;
  }

  // 2) ak je request_type číslo ("1", "1.5", ...)
  if (s.request_type && /^[0-9]+(\.[0-9]+)?$/.test(s.request_type)) {
    return parseFloat(s.request_type);
  }

  // 3) xD, xN, X, prázdne = 0 hodín
  return 0;
}

//──────────────────────────────────────────────────────────────
// Definícia stĺpcov tabuľky
export function shiftTableStats(normHours) {
  return [
    {
      key: "totalHours",
      label: "SH",
      calc: (shifts) =>
        shifts.reduce((sum, s) => sum + (HOURS[s.shift_type] || 0), 0),
    },
    {
      key: "dayShifts",
      label: "D",
      calc: (shifts) => shifts.filter((s) => DAY_SET.has(s.shift_type)).length,
    },
    {
      key: "nightShifts",
      label: "N",
      calc: (shifts) =>
        shifts.filter((s) => NIGHT_SET.has(s.shift_type)).length,
    },
    {
      key: "holiday",
      label: "RD",
      calc: (shifts) => shifts.filter((s) => s.shift_type === HOLIDAY).length,
    },
    {
      key: "sickness",
      label: "PN",
      calc: (shifts) => shifts.filter((s) => s.shift_type === SICKDAY).length,
    },
    {
      key: "overtime",
      label: "NČ",
      calc: (shifts) => {
        const regular = shifts.reduce(
          (sum, s) => sum + (HOURS[s.shift_type] || 0),
          0,
        );
        const extra = shifts.reduce((sum, s) => sum + reqHours(s), 0);
        return regular + extra - normHours; // služba + čísla − norma
      },
    },
    {
      key: "totalShifts",
      label: "PS",
      calc: (shifts) =>
        shifts.reduce((sum, s) => sum + (UNITS[s.shift_type] || 0), 0),
    },
  ];
}
