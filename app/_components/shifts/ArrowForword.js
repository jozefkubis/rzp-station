import { HiArrowNarrowRight } from "react-icons/hi";

export default function ArrowForword() {
    return (
        <div className="bg-primary-50 rounded-lg px-2 cursor-pointer hover:bg-white hover:ring-1 active:scale-95">
            <HiArrowNarrowRight className="text-2xl text-primary-300  " />
        </div>
    )
}