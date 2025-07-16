export function ShiftRowDay({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm ring ring-yellow-500 2xl:text-xl">
      {children}
    </p>
  );
}

export function ShiftRowNight({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm ring ring-primary-500 2xl:text-xl">
      {children}
    </p>
  );
}

export function ShiftDay({ children }) {
  return (
    <h2 className="text-md flex items-center gap-3 self-start rounded-lg px-3 py-3 font-extrabold 2xl:text-lg">
      {children}
    </h2>
  );
}
export function Day({ children }) {
  return (
    <h2 className="flex items-center gap-3 self-start rounded-lg px-3 py-3 text-lg font-extrabold 2xl:text-xl">
      {children}
    </h2>
  );
}

export function ShiftsTable({ children }) {
  return <div className="flex w-full flex-col gap-2 p-4">{children}</div>;
}

export function ShiftsDayNightTable({ children }) {
  return (
    <div className="mx-auto flex w-[70%] flex-col gap-3 p-4">{children}</div>
  );
}

export function ShiftsSection({ children }) {
  return (
    <div className="flex w-full flex-col divide-y divide-slate-200 rounded-2xl bg-white p-8 text-primary-700 shadow">
      {children}
    </div>
  );
}
