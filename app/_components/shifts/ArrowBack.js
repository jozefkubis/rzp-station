import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ArrowBack({ goTo, shiftsOffset, disabled }) {
  return (
    <button
      type="button"
      onClick={() => goTo(Number(shiftsOffset) - 1)}
      disabled={disabled}
      aria-label="Previous month"
      className="no-print cursor-pointer rounded-lg bg-primary-50 px-2 active:scale-95 disabled:opacity-40 lg:hover:bg-white lg:hover:ring-1"
    >
      <HiArrowNarrowLeft className="text-xl text-primary-300 md:text-2xl" />
    </button>
  );
}
