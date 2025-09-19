import { addMonths } from "date-fns";

export function formatDate(dateString) {
  if (!dateString) return "?";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // pripája nulku vpredu
const day = String(today.getDate()).padStart(2, "0");
const tmrwDay = String(today.getDate() + 1).padStart(2, "0");
export const dateStr = `${year}-${month}-${day}`; // napr. "2025-06-01"
export const tmrwDateStr = `${year}-${month}-${tmrwDay}`;

export function getDaysUntilNextMedCheck(medCheckDateStr) {
  if (!medCheckDateStr) return null;

  const lastCheck = new Date(medCheckDateStr);
  const nextCheck = new Date(lastCheck); // kopia
  nextCheck.setFullYear(nextCheck.getFullYear() + 1); // +1 rok

  const today = new Date();
  today.setHours(0, 0, 0, 0); // vynulujeme čas (pre presný počet dní)
  nextCheck.setHours(0, 0, 0, 0); // aj tu

  const diffMs = nextCheck.getTime() - today.getTime(); // rozdiel v ms
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)); // prepočítame na dni

  return diffDays;
}

export function getWeatherIcon(code) {
  // https://open-meteo.com/en/docs#weathervariables
  if (code === 0) return "☀️"; // jasno
  if (code === 1 || code === 2) return "⛅"; // polooblačno
  if (code === 3) return "☁️"; // zamračené

  if (code === 45 || code === 48) return "🌫️"; // hmla
  if (code === 51 || code === 53 || code === 55) return "🌦️"; // mrholenie
  if (code === 61 || code === 63) return "🌧️"; // dážď mierny
  if (code === 65 || code === 82) return "⛈️"; // lejak
  if (code === 66 || code === 67) return "🌧️❄️"; // mrznúci dážď
  if (code === 71 || code === 73) return "🌨️"; // sneženie
  if (code === 75 || code === 77) return "❄️"; // silné sneženie
  if (code === 80 || code === 81) return "🌦️"; // prehánky
  if (code === 95) return "⛈️"; // búrka
  if (code === 96 || code === 99) return "⛈️⚡"; // búrka s krúpami

  return "❔"; // fallback
}


export function getYearMonthFromOffset(offset) {
  const intM = Number(offset || 0);
  const base = new Date();
  const dt = addMonths(base, intM); // date-fns spoľahlivo posunie mesiac
  return { year: dt.getFullYear(), month: dt.getMonth() + 1 }; // 1..12
}

export function buildRosterFromShifts(rows) {
  const seen = new Set();
  const roster = [];
  for (const r of rows || []) {
    if (!seen.has(r.user_id)) {
      roster.push({
        user_id: r.user_id,
        full_name: r.profiles?.full_name ?? "",
        avatar_url: r.profiles?.avatar_url ?? null,
      });
      seen.add(r.user_id);
    }
  }
  return roster; // presne v poradí pridávania (inserted_at ASC)
}

export function monthBounds(m = 0) {
  const now = new Date();
  const totalM = now.getMonth() + Number(m || 0);
  const year = now.getFullYear() + Math.floor(totalM / 12);
  const month0 = ((totalM % 12) + 12) % 12;       // 0..11
  const month = month0 + 1;                       // 1..12
  const pad = (n) => String(n).padStart(2, "0");
  const from = `${year}-${pad(month)}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const to = `${year}-${pad(month)}-${pad(lastDay)}`;

  // prev month
  const prevDate = new Date(year, month0 - 1, 1);
  const pY = prevDate.getFullYear();
  const pM0 = prevDate.getMonth();                // 0..11
  const pM = pM0 + 1;
  const prevFrom = `${pY}-${pad(pM)}-01`;
  const prevLast = new Date(pY, pM, 0).getDate();
  const prevTo = `${pY}-${pad(pM)}-${pad(prevLast)}`;

  return { year, month, from, to, prevFrom, prevTo };
}