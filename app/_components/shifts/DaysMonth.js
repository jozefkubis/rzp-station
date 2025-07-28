export default function DaysMonth({ children, headBg }) {
    return (
        <div
            className={`flex h-9 items-center justify-center border-b border-l text-xs ${headBg} text-[0.9rem]`}
        >
            {children}
        </div>
    );
}
