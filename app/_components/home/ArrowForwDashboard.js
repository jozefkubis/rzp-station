import { HiArrowNarrowRight } from "react-icons/hi";

export default function ArrowForwDashboard() {
  return (
    <button
      type="button"
      aria-label="Next month"
      className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95"
    >
      <HiArrowNarrowRight className="text-2xl text-primary-300" />
    </button>
  );
}
