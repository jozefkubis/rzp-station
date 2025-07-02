"use client";

import { useFormStatus } from "react-dom";
import SpinnerMini from "./SpinnerMini";

const buttonSizes = {
  small: "text-xs px-3 py-1 uppercase font-semibold",
  medium: "text-sm px-4 py-2 font-medium",
  large: "text-base px-6 py-3 font-medium",
};

const buttonVariants = {
  primary: "text-white bg-blue-600 hover:bg-blue-700 active:scale-95  w-xl",
  secondary:
    "text-gray-600 bg-gray-100 border border-gray-300 hover:bg-gray-200 active:scale-95",
  secondaryShiftRD:
    "text-gray-600 bg-green-500 border border-geen-500 hover:bg-green-300 hover:border-green-300 active:scale-95",
  secondaryShiftX:
    "text-gray-600 bg-red-300 border border-red-300 hover:bg-red-200 hover:border-red-200 active:scale-95",
  tertiary:
    "text-gray-600 bg-[#FFF144] border border-gray-300 hover:bg-[#FFD01C] active:scale-95",
  danger: "text-white bg-red-600 hover:bg-red-700 active:scale-95 w-xl",
};

export default function Button({
  size = "medium",
  variant = "primary",
  children,
  type, // default = button
  ...props
}) {
  const { pending } = useFormStatus();

  // Spinner len ak ide o SUBMIT v pending stave
  const showPending = pending && type === "submit";

  return (
    <button
      disabled={showPending}
      type={type}
      className={`rounded-md transition-colors duration-200 ${buttonSizes[size]} ${buttonVariants[variant]}`}
      {...props}
    >
      {showPending ? <SpinnerMini /> : children}
    </button>
  );
}
