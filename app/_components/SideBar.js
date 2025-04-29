import clsx from "clsx";
import Link from "next/link";

export default function SideBar({ link, isActive }) {
  return (
    <li
      key={link.name}
      className={clsx(
        "rounded-md p-3 transition-transform duration-300 ease-in-out hover:bg-primary-50 active:scale-95 text-left pl-6",
        { "bg-primary-50": isActive },
      )}
    >
      <Link href={link.href} className="block h-full w-full">
        {link.name}
      </Link>
    </li>
  );
}
