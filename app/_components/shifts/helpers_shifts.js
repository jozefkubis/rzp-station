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
