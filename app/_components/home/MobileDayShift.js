export default function MobileTodayDayShift({
    label,
    dateString,
    dayData = [],
}) {
    const hasData = dayData && dayData.length > 0;

    const localDate = new Date(dateString).toLocaleDateString("sk-SK", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });



    return (
        <div className="flex flex-col bg-white px-4 p-8 gap-2">
            {/* Nadpis alebo dátum */}
            {label && (
                <h5 className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
                    {label}: {localDate} 06:00 - 18:00
                </h5>
            )}

            {/* Mená pod sebou */}
            <div className="flex flex-col gap-2 text-lg font-medium text-primary-600">
                {hasData ? (
                    dayData.map((name, i) => (
                        <span key={i} className="flex  items-center rounded-md border border-gray-200 bg-white px-4 py-2 shadow-lg ring-1 ring-slate-300">
                            {name}
                        </span>
                    ))
                ) : (
                    <span className="text-gray-400">—</span>
                )}
            </div>
        </div>
    );
}
