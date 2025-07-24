"use client";
import Link from "next/link";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ArrowBackDashboard({ offset }) {
  const newOffset = offset - 1;

  return (
    <Link
      href={`?m=${newOffset}`}
      aria-label="Predchádzajúci mesiac"
      className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95"
    >
      <HiArrowNarrowLeft className="text-2xl text-primary-300" />
    </Link>
  );
}
