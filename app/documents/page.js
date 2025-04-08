import Header from "../_components/Header"

export const metadata = {
    title: "Dokumenty",
}

function page() {
    return (
        <div>
            <Header />
            <div className="h-screen">
                <div className="border-r border-primary-200 fixed left-0 top-0 h-screen w-[15rem] pt-[10rem]">
                    <ul className="space-y-4 text-primary-700 font-semibold text-lg text-center">
                        <li>test</li>
                        <li>test</li>
                        <li>test</li>
                        <li>test</li>
                        <li>test</li>
                    </ul>
                </div>
                <div className="flex items-center justify-center pl-[15rem] h-full">
                    <h1 className="text-8xl text-primary-700 font-bold">Dokumenty</h1>
                </div>
            </div>
        </div>
    )
}

export default page
