export function ShiftRowDay({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-xs font-semibold text-primary-700 shadow ring-2 ring-yellow-400 md:text-[0.9rem] 2xl:text-xl">
      {children}
    </p>
  );
}

export function ShiftRowNight({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-xs font-semibold text-primary-700 shadow ring-2 ring-primary-400 md:text-[0.9rem] 2xl:text-xl">
      {children}
    </p>
  );
}

export function ShiftDay({ children }) {
  return (
    <h2 className="flex items-center gap-3 self-start rounded-lg px-3 py-3 text-sm font-bold 2xl:text-lg">
      {children}
    </h2>
  );
}
export function Day({ children }) {
  return (
    <h2 className="flex items-center gap-3 self-start rounded-lg px-3 py-3 text-sm font-bold 2xl:text-lg">
      {children}
    </h2>
  );
}

export function ShiftsTable({ children }) {
  return (
    <div className="flex w-full flex-col lg:gap-1">{children}</div>
  );
}

export function ShiftsDayNightTable({ children }) {
  return (
    <div className="mx-auto flex md:w-[100%] lg:w-[80%] flex-col gap-3 md:pb-4 lg:pt-1">
      {children}
    </div>
  );
}

export function ShiftsSection({ children }) {
  return (
    <div className="flex w-full flex-col divide-y divide-slate-200 rounded-2xl bg-white text-primary-700 shadow-sm md:p-3">
      {children}
    </div>
  );
}
