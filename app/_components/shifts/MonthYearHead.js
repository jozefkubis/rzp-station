export default function MonthYearHead({ children }) {
    return <div className="h-[2.5rem] border-b py-2 text-center">
        <span className="fixed">
            {children}
        </span>
    </div>
}