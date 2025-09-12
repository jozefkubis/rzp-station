// 1) Počet dní v mesiaci (month = 1..12)
export function getDayCount(year, month) {
  return new Date(year, month, 0).getDate();
}

// 2) Pole objektov pre každý deň mesiaca
export function getDaysArray(year, month) {
  const total = getDayCount(year, month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: total }, (_, i) => {
    const date = new Date(year, month - 1, i + 1);
    date.setHours(0, 0, 0, 0);
    const weekday = date.getDay(); // 0 = nedeľa, 6 = sobota

    return {
      day: i + 1,
      dateStr: date.toLocaleDateString("sv-SE"), // "YYYY-MM-DD"
      isWeekend: weekday === 0 || weekday === 6,
      isToday: date.getTime() === today.getTime(),
    };
  });
}

// 3) Lokalizované názvy mesiacov
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

/* ──────────────────────────────────────────────────────────
   Pomocníci proti plávajúcej desatinnej bodke a formátovanie
   ────────────────────────────────────────────────────────── */
export function round1(n) {
  // zaokrúhlenie na 1 desatinné miesto
  return Math.round((Number(n) + Number.EPSILON) * 10) / 10;
}
export function clampNearZero(n) {
  // zruší -0.0 a drobné zvyšky typu -0.08 → 0
  return Math.abs(n) < 0.05 ? 0 : n;
}
export function fmtHours(n) {
  const v = clampNearZero(round1(n));
  return Number.isInteger(v) ? String(v) : v.toFixed(1);
}
// tolerantný prevod textu na číslo (podporí aj čiarku)
function toNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const s = String(value).replace(",", ".").trim();
  const num = parseFloat(s);
  return isNaN(num) ? 0 : num;
}

/* ──────────────────────────────────────────────────────────
   KONŠTANTY PRE ŠTATISTIKU
   ────────────────────────────────────────────────────────── */

// Trvanie smien v hodinách
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
  PN: 7.5, // PN počítame ako 7.5h do normy
};

// Zoskupenia typov
const DAY_SET = new Set(["D", "vD", "zD", "DN", "ND"]);
const NIGHT_SET = new Set(["N", "vN", "zN", "DN", "ND"]);
const HOLIDAY = "RD";
const SICKDAY = "PN";

// Jednotky služby pre stĺpec PS
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

// Hodiny z požiadavky (spodný riadok)
function reqHours(s) {
  // 1) ak prišlo číslo (request_hours má prioritu)
  if (s.request_hours != null) return toNumber(s.request_hours);

  // 2) ak je request_type číselný string (podporí aj "1,5")
  const rt = s.request_type;
  if (rt && /^[0-9]+([.,][0-9]+)?$/.test(String(rt))) {
    return toNumber(rt);
  }

  // 3) xD, xN, X, prázdne = 0 hodín
  return 0;
}

/* ──────────────────────────────────────────────────────────
   Definícia stĺpcov tabuľky (štatistika)
   ────────────────────────────────────────────────────────── */
export function shiftTableStats(normHours) {
  return [
    {
      key: "totalHours",
      label: "SH",
      calc: (shifts) => {
        const raw = shifts.reduce(
          (sum, s) => sum + (HOURS[s.shift_type] || 0),
          0,
        );
        return clampNearZero(round1(raw));
      },
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
        const raw = regular + extra - toNumber(normHours);
        return clampNearZero(round1(raw));
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
