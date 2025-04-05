import Header from "../_components/Header"

export const metadata = {
    title: "Kalendár",
}

function page() {
    return (
        <div>
            <Header />
            <div className="flex h-screen items-center justify-center ">
                <h1 className="text-8xl text-primary-700 font-bold">Calendar</h1>
            </div>
        </div>
    )
}

export default page
