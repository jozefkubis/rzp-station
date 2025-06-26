export default function RowDays({ children, cellBg }) {
    return (
        <div
            className={`flex h-9 cursor-pointer items-center justify-center border-l border-slate-200 hover:bg-blue-100 ${cellBg}`}
        >
            {children}
        </div>
    );
}
