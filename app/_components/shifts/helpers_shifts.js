export function getDayCount(year, month) {
    // month píšeme 1–12 (január = 1)
    // 0. deň nasledujúceho mesiaca = posledný deň hľadaného
    return new Date(year, month, 0).getDate();
}


export function getDaysArray(year, month) {
    const total = getDayCount(year, month); // 28/30/31
    return Array.from({ length: total }, (_, i) => {
        const day = i + 1;
        const dateObj = new Date(year, month - 1, day); // JS mesiac = 0–11
        const weekday = dateObj.getDay();               // 0 = nedeľa … 6 = sobota

        return {
            day,                              // 1, 2, 3…
            dateStr: dateObj.toISOString().slice(0, 10), // "2025-06-15"
            isWeekend: weekday === 0 || weekday === 6,   // true/false
        };
    });
}
