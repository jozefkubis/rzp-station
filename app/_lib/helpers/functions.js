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