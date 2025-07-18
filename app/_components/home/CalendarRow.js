export function CalendarMainRow({ children }) {
  return (
    <main className="grid h-full w-full grid-rows-2 divide-y divide-slate-200">
      {children}
    </main>
  );
}

export function CalendarDivRow({ children }) {
  return <div className="flex flex-col gap-5">{children}</div>;
}

export function CalendarHeaderRow({ children }) {
  return (
    <h2 className="flex items-center gap-3 self-start rounded-lg px-3 py-3 text-sm font-extrabold md:text-base 2xl:text-lg">
      {children}
    </h2>
  );
}

export function CalendarPRow({ children }) {
  return (
    <div className="mx-auto w-[80%] rounded-xl bg-slate-50 p-4 text-sm font-medium ring-1 ring-slate-300 md:text-base 2xl:text-xl">
      <ul>
        {children}
      </ul>
    </div>
  );
}
