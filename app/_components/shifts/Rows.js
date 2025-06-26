export default function Rows({ children, rowBg, colTemplate }) {
    return <div
        className={`grid text-sm ${rowBg}`}
        colTemplate={{ gridTemplateColumns: colTemplate }}
    >
        {children}
    </div>
}