export function ShiftRowDay({ children }) {
    return (
        <p className="rounded-full bg-yellow-300 px-3 py-1 text-[1rem] font-semibold text-primary-800 shadow-sm 2xl:text-2xl">
            {children}
        </p>
    );
}

export function ShiftRowNight({ children }) {
    return (
        <p className="rounded-full bg-primary-600 px-3 py-1 text-[1rem] font-semibold text-primary-50 shadow-sm 2xl:text-2xl">
            {children}
        </p>
    );
}

export function ShiftDay({ children }) {
    return (
        <h2 className="mx-auto my-auto text-2xl font-extrabold 2xl:text-3xl">
            {children}
        </h2>
    );
}

export function ShiftsTable({ children }) {
    return (
        <div className="grid items-start gap-y-3 md:grid-cols-[10rem_1fr] xl:grid-cols-[13rem_1fr] 2xl:grid-cols-[18rem_1fr]">
            {children}
        </div>
    );
}

export function ShiftsDayNightTable({ children }) {
    return (
        <div className="flex flex-col gap-3">
            {children}
        </div>
    );
}

export function ShiftsSection({ children }) {
    return (
        <div className="w-full rounded-2xl bg-white p-8 shadow space-y-6 text-primary-700 flex flex-col justify-center">
            {children}
        </div>
    );
}