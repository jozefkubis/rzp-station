import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ArrowBack({ goTo, shiftsOffset, disabled }) {
    return (
        <button
            type="button"
            onClick={() => goTo(Number(shiftsOffset) - 1)}
            disabled={disabled}
            aria-label="Previous month"
            className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95 disabled:opacity-40"
        >
            <HiArrowNarrowLeft className="text-2xl text-primary-300" />
        </button>
    );
}
