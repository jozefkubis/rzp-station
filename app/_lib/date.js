export function monthKeyFromOffset(m = 0) {
    const now = new Date();
    const totalM = now.getMonth() + Number(m || 0);
    const y = now.getFullYear() + Math.floor(totalM / 12);
    const m0 = ((totalM % 12) + 12) % 12;
    const mm = String(m0 + 1).padStart(2, "0");
    return `${y}-${mm}`; // napr. "2025-09"
}
