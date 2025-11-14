export default function ShiftStatsRowDay({ children, cellBg, rowBg }) {
  return (
    <button
      type="button"
      className={`flex h-10 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 2xl:h-14 ${cellBg} ${rowBg} border-b border-slate-200 text-[0.65rem] 2xl:text-[0.9rem]`}
    >
      {children}
    </button>
  );
}
