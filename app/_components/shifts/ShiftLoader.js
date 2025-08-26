import Spinner from "../Spinner"

export default function ShiftLoader() {
    return (
        <div className="fixed inset-0 z-50 bg-primary-50 bg-opacity-30 backdrop-blur-sm transition-all duration-500">
            <div className="flex justify-center items-center h-screen w-full">
                <Spinner />
            </div>
        </div>
    )
}

