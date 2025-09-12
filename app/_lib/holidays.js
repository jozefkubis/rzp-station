import Holidays from "date-holidays";

export function getSlovakHolidaysForYear(year) {
  const hd = new Holidays("SK"); // Slovakia
  const list = hd.getHolidays(year);

  return list
    .filter((h) => ["public", "bank"].includes(h.type))
    .map((h) => h.date.slice(0, 10)); // YYYY-MM-DD
}

export function getHolidaySetForMonth(year, month1to12) {
  const all = getSlovakHolidaysForYear(year);
  const mm = String(month1to12).padStart(2, "0");
  return new Set(all.filter((date) => date.startsWith(`${year}-${mm}`)));
}
