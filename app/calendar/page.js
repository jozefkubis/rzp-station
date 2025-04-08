import Header from "../_components/Header"

export const metadata = {
    title: "Kalendár",
}

function page() {

    return (
        <div>
            <Header />
            <div className="h-screen">
                <div className="border-r border-primary-200 fixed left-0 top-0 h-screen w-[15rem] pt-[10rem]">
                    <ul className="space-y-0 text-primary-700 font-semibold text-lg text-center px-4">
                        <li className="hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer">test</li>
                        <li className="hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer">test</li>
                        <li className="hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer">test</li>
                        <li className="hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer">test</li>
                        <li className="hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer">test</li>
                        <li className="hover:bg-primary-50 p-4 rounded-md active:scale-95 transition-transform duration-300 ease-in-out cursor-pointer">test</li>
                    </ul>
                </div>
                <div className="flex items-center justify-center pl-[15rem] h-full">
                    <h1 className="text-8xl text-primary-700 font-bold">Kalendár</h1>
                </div>
            </div>
        </div>
    )
}

export default page
