export default function DaysMonth({ children, headBg }) {
  return (
    <div
      className={`flex h-6 items-center justify-center border-b border-l text-xs 2xl:h-9 ${headBg} text-[0.7rem] md:text-[0.6rem] 2xl:text-[0.9rem]`}
    >
      {children}
    </div>
  );
}
