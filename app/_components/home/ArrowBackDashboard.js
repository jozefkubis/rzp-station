// ArrowForwDashboard.js
"use client";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function ArrowBackDashboard({ offset, goTo, disabled }) {
  return (
    <button
      onClick={() => goTo(offset - 1)}
      aria-label="Ďalší mesiac"
      disabled={disabled}
      className="cursor-pointer rounded-lg bg-primary-50 px-2 hover:bg-white hover:ring-1 active:scale-95 disabled:opacity-40"
    >
      <HiArrowNarrowLeft className="text-2xl text-primary-300" />
    </button>
  );
}

/* ArrowBackDashboard rovnaký s ľavým šípkovým ikonou */
