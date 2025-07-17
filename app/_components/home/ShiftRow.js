export function ShiftRowDay({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-xs md:text-sm font-semibold text-primary-700 shadow ring-2 ring-yellow-400">
      {children}
    </p>
  );
}

export function ShiftRowNight({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-xs md:text-sm font-semibold text-primary-700 shadow ring-2 ring-primary-400">
      {children}
    </p>
  );
}

export function ShiftDay({ children }) {
  return (
    <h2 className="flex items-center gap-3 self-start rounded-lg px-3 py-3 text-sm md:text-base font-bold 2xl:text-lg">
      {children}
    </h2>
  );
}
export function Day({ children }) {
  return (
    <h2 className="text-sm md:text-base flex items-center gap-3 self-start rounded-lg px-3 py-3 font-bold 2xl:text-xl">
      {children}
    </h2>
  );
}

export function ShiftsTable({ children }) {
  return <div className="flex w-full flex-col gap-2">{children}</div>;
}

export function ShiftsDayNightTable({ children }) {
  return (
    <div className="mx-auto flex w-[80%] flex-col gap-3">{children}</div>
  );
}

export function ShiftsSection({ children }) {
  return (
    <div className="flex w-full flex-col divide-y divide-slate-200 rounded-2xl bg-white p-6 shadow-sm">
      {children}
    </div>
  );
}
