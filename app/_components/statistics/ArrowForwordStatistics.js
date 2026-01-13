import { HiArrowNarrowRight } from "react-icons/hi";

export default function ArrowForwardStatistics({ goToNextYear }) {
  return (
    <button
      type="button"
      onClick={goToNextYear}
      aria-label="Next year"
      className="cursor-pointer rounded-lg bg-primary-50 px-2 active:scale-95 disabled:opacity-40 lg:hover:bg-white lg:hover:ring-1"
    >
      <HiArrowNarrowRight className="text-2xl text-primary-300" />
    </button>
  );
}
