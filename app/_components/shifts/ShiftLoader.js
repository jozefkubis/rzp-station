import Spinner from "../Spinner"

export default function ShiftLoader() {
    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
            <div className="flex justify-center items-center h-screen w-full">
                <Spinner />
            </div>
        </div>
    )
}

