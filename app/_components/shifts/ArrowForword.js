import { copyRosterIfEmpty } from "@/app/_lib/actions";
import { startTransition } from "react";
import { HiArrowNarrowRight } from "react-icons/hi";

export default function ArrowForward({ goTo, shiftsOffset, disabled }) {
  function handleClick() {
    startTransition(() => {
      copyRosterIfEmpty(Number(shiftsOffset) + 1).then(() => {
        goTo(Number(shiftsOffset) + 1);
      });
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label="Next month"
      className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95 disabled:opacity-40"
    >
      <HiArrowNarrowRight className="text-2xl text-primary-300" />
    </button>
  );
}
