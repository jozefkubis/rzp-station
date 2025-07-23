"use client";
import Link from "next/link";
import { HiArrowNarrowRight } from "react-icons/hi";

export default function ArrowForwDashboard({ offset }) {
  const newOffset = offset + 1;

  return (
    <Link
      href={`?m=${newOffset}`}
      prefetch={false}
      aria-label="Ďalší mesiac"
      className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95"
    >
      <HiArrowNarrowRight className="text-2xl text-primary-300" />
    </Link>
  );
}
