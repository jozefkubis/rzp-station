export default function AllParamedics({ children, rowBg }) {
    return <div
        className={`sticky left-0 z-20 flex items-center justify-center px-2 py-1 ${rowBg} hover:bg-blue-100`}
    >
        {children}
    </div>
}