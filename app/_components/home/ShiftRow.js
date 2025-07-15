export function ShiftRowDay({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm 2xl:text-xl ring ring-yellow-500">
      {children}
    </p>
  );
}

export function ShiftRowNight({ children }) {
  return (
    <p className="rounded-full bg-slate-50 px-3 py-3 text-[1rem] font-semibold text-primary-700 shadow-sm 2xl:text-xl ring ring-primary-500">
      {children}
    </p>
  );
}

export function ShiftDay({ children }) {
  return (
    <h2 className="text-md self-start font-extrabold 2xl:text-lg bg-slate-50 rounded-lg px-3 py-3 flex items-center gap-3">
      {children}
    </h2>
  );
}

export function ShiftsTable({ children }) {
  return (
    <div className="flex flex-col p-4 gap-2 w-full">
      {children}
    </div>
  );
}

export function ShiftsDayNightTable({ children }) {
  return <div className="flex flex-col p-4 gap-3 w-[80%] mx-auto">{children}</div>;
}

export function ShiftsSection({ children }) {
  return (
    <div className="w-full rounded-2xl bg-white p-8 shadow text-primary-700 divide-y divide-slate-200">
      {children}
    </div>
  );
}
