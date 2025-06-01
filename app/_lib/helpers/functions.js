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
