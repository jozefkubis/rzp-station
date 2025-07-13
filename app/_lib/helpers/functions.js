export function formatDate(dateString) {
  if (!dateString) return "❔";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
}

const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0"); // pripája nulku vpredu
const day = String(today.getDate()).padStart(2, "0");
export const dateStr = `${year}-${month}-${day}`; // napr. "2025-06-01"

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
