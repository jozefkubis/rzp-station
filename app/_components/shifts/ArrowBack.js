import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ArrowBack({ setCount }) {

    const handleClick = () => setCount(c => c - 1);

    return (
        <button type="button" onClick={handleClick} aria-label="Previous month" className="bg-primary-50 rounded-lg px-2 cursor-pointer hover:bg-white hover:ring-1 active:scale-95">
            <HiArrowNarrowLeft className="text-2xl text-primary-300  " />
        </button>
    )
}