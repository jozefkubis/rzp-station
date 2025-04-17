// import Logo from "./Logo"
import Navigation from "./Navigation"
import UserHeaderInfo from "./UserHeaderInfo"

function Header() {
    return (
        <header className="border-b border-primary-200 text-primary-50 px-8 py-1 sticky top-0 z-50 bg-gray-50">
            <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
                <UserHeaderInfo />
                <Navigation />
            </div>
        </header>
    )
}

export default Header
