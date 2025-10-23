// import Logo from "./Logo"
import MobileHeaderNav from "./MobileHeaderNav";
import Navigation from "./Navigation";
import UserHeaderInfo from "./UserHeaderInfo";

function Header() {
  return (
    <>
      <header
        data-cy="header"
        className="sticky top-0 z-50 hidden border-b border-primary-200 bg-gray-50 px-8 py-1 text-primary-50 md:block"
      >
        <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between">
          <UserHeaderInfo />
          <Navigation />
        </div>
      </header>

      <div className="md:hidden">
        <MobileHeaderNav />
      </div>
    </>
  );
}

export default Header;
