import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ArrowBackStatistics({ goToPrevYear }) {
  return (
    <button
      type="button"
      onClick={() => goToPrevYear()}
      aria-label="Previous month"
      className="cursor-pointer rounded-lg bg-primary-50 px-2 active:scale-95 disabled:opacity-40 lg:hover:bg-white lg:hover:ring-1"
    >
      <HiArrowNarrowLeft className="text-2xl text-primary-300" />
    </button>
  );
}
