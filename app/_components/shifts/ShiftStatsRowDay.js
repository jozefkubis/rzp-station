export default function ShiftStatsRowDay({ children, cellBg }) {
    return (
        <button
            type="button"
            className={`flex h-16 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg} border-b border-slate-200 text-[1rem]`}
        >
            {children}
        </button>

    );
}
