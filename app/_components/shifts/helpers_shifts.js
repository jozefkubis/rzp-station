// 1) Koľko dní má mesiac (month = 1-12)
export function getDayCount(year, month) {
  // 0. deň nasledujúceho mesiaca = posledný deň hľadaného
  return new Date(year, month, 0).getDate();
}

// 2) Vygeneruje pole objektov pre každý deň mesiaca
export function getDaysArray(year, month) {
  const total = getDayCount(year, month); // 28 / 30 / 31

  // dnešok – lokálne, čistá polnoc
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Array.from({ length: total }, (_, i) => {
    // dátum i-tého dňa (tiež lokálna polnoc)
    const date = new Date(year, month - 1, i + 1);
    date.setHours(0, 0, 0, 0);

    const weekday = date.getDay(); // 0 = nedeľa … 6 = sobota

    return {
      day: i + 1, // 1, 2, 3…
      dateStr: date.toLocaleDateString("sv-SE"),
      isWeekend: weekday === 0 || weekday === 6,
      isToday: date.getTime() === today.getTime(), // presne dnešok
    };
  });
}

export function getMonthOnly() {
  const today = new Date();

  const monthLower = new Intl.DateTimeFormat("sk-SK", {
    month: "long",
  }).format(today); // „jún“

  const monthCapital = monthLower.charAt(0).toUpperCase() + monthLower.slice(1);

  return monthCapital;
}

export function MONTHS() {
  const months = [
    "január",
    "február",
    "marec",
    "apríl",
    "máj",
    "jún",
    "júl",
    "august",
    "september",
    "oktober",
    "november",
    "december",
  ];
  return months;
}

// helpers_shifts.js
// ────────────────────────────────────────────────────────────────

// 1️⃣ Trvanie jednotlivých smien (v hodinách)
export const HOURS = {
  D: 12, // denná
  N: 12, // nočná
  RD: 7.5, // dovolenka
  vD: 12,
  zD: 12,
  vN: 12,
  zN: 12,
  DN: 24,
  ND: 24, // 24‑hodinové
};

// 2️⃣ Zoskupenia typov smien
const DAY_SET = new Set(["D", "vD", "zD", "DN", "ND"]);
const NIGHT_SET = new Set(["N", "vN", "zN", "DN", "ND"]);
const HOLIDAY = "RD";

// 3️⃣ Koľko „služieb“ má každá smena
//    (DN/ND počítame ako 2, ostatné ako 1; dovolenka 0)
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
};

// 4️⃣ Konfigurácia stĺpcov tabuľky
export function shiftTableStats(normHours) {
  return [
    // Σ hodín
    {
      key: "totalHours",
      label: "SH",
      calc: (shifts) =>
        shifts.reduce((sum, s) => sum + (HOURS[s.type] || 0), 0),
    },

    // Denné služby
    {
      key: "dayShifts",
      label: "D",
      calc: (shifts) => shifts.filter((s) => DAY_SET.has(s.type)).length,
    },

    // Nočné služby
    {
      key: "nightShifts",
      label: "N",
      calc: (shifts) => shifts.filter((s) => NIGHT_SET.has(s.type)).length,
    },

    // Dovolenka
    {
      key: "holiday",
      label: "RD",
      calc: (shifts) => shifts.filter((s) => s.type === HOLIDAY).length,
    },

    // Nadčas = Σ hodín − norma
    {
      key: "overtime",
      label: "NČ",
      calc: (shifts) =>
        shifts.reduce((sum, s) => sum + (HOURS[s.type] || 0), 0) - normHours,
    },

    // Σ služieb (vážené)
    {
      key: "totalShifts",
      label: "PS",
      calc: (shifts) =>
        shifts.reduce((sum, s) => sum + (UNITS[s.type] || 0), 0),
    },
  ];
}
