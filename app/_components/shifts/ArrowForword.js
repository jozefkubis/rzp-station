import { HiArrowNarrowRight } from "react-icons/hi";

export default function ArrowForword({ setCount }) {

    const handleClick = () => setCount(c => c + 1);


    return (
        <button type="button" onClick={handleClick} aria-label="Next month" className="bg-primary-50 rounded-lg px-2 cursor-pointer hover:bg-white hover:ring-1 active:scale-95">
            <HiArrowNarrowRight className="text-2xl text-primary-300" />
        </button>
    )
}