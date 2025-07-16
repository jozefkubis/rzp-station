export function CalendarMainRow({ children }) {
  return (
    <main className="grid h-full w-full grid-rows-2 divide-y divide-slate-200">
      {children}
    </main>
  );
}

export function CalendarDivRow({ children }) {
  return <div className="flex flex-col gap-5 p-4">{children}</div>;
}

export function CalendarHeaderRow({ children }) {
  return (
    <h2 className="text-md flex items-center gap-3 self-start rounded-lg bg-slate-50 px-3 py-3 font-extrabold 2xl:text-lg">
      {children}
    </h2>
  );
}

export function CalendarPRow({ children }) {
  return (
    <p className="mx-auto w-[70%] rounded-xl bg-slate-50 p-4 py-6 text-xl font-semibold ring-2 ring-slate-300 2xl:text-2xl">
      {children}
    </p>
  );
}
