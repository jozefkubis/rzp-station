// import Logo from "./Logo"
import MobileHeaderNav from "./MobileHeaderNav"
import Navigation from "./Navigation"
import UserHeaderInfo from "./UserHeaderInfo"

function Header() {
    return (
        <>
            <header data-cy="header" className="hidden md:block border-b border-primary-200 text-primary-50 px-8 py-1 sticky top-0 z-50 bg-gray-50">
                <div className="flex justify-between items-center max-w-screen-xl mx-auto w-full">
                    <UserHeaderInfo />
                    <Navigation />
                </div>
            </header>

            <div className="md:hidden">
                <MobileHeaderNav />
            </div>
        </>
    )
}

export default Header
