export function CalendarMainRow({ children }) {
    return (
        <main className="grid h-full w-full grid-rows-2 divide-y divide-slate-200">
            {children}
        </main>
    );
}

export function CalendarDivRow({ children }) {
    return <div className="flex flex-col gap-2 p-4">{children}</div>;
}

export function CalendarHeaderRow({ children }) {
    return (
        <h2 className="self-start rounded-lg bg-slate-50 px-3 py-3 text-lg font-extrabold 2xl:text-xl flex items-center gap-3">
            {children}
        </h2>
    );
}

export function CalendarPRow({ children }) {
    return (
        <p className="w-[80%]mx-auto mx-auto text-xl font-semibold 2xl:text-3xl">
            {children}
        </p>
    );
}
