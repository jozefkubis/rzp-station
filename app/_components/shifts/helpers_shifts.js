export function getDayCount(year, month) {
    // month píšeme 1–12 (január = 1)
    // 0. deň nasledujúceho mesiaca = posledný deň hľadaného
    return new Date(year, month, 0).getDate();
}

export function getDaysArray(year, month) {
    const total = getDayCount(year, month);
    const todayStr = new Date().toISOString().slice(0, 10); // „2025-06-25“

    return Array.from({ length: total }, (_, i) => {
        const day = i + 1;
        const dateObj = new Date(year, month - 1, day);
        const dateStr = dateObj.toISOString().slice(0, 10);
        const weekday = dateObj.getDay();

        return {
            day,
            dateStr,
            isWeekend: weekday === 0 || weekday === 6,
            isToday: dateStr === todayStr,   // 🔸 porovnávame celý dátum
        };
    });
}


export function getMonthOnly() {
    const today = new Date();

    const monthLower = new Intl.DateTimeFormat("sk-SK", {
        month: "long",
    }).format(today);                // „jún“

    const monthCapital =
        monthLower.charAt(0).toUpperCase() + monthLower.slice(1);

    return monthCapital;
}
