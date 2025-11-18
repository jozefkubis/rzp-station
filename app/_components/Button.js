"use client";

const buttonSizes = {
  small: "text-[0.7rem] md:text-xs px-3 py-1 uppercase font-semibold",
  medium: "text-[0.7rem] md:text-sm px-2 md:px-4 py-1 md:py-2 font-medium",
  large: "text-xs 2xl:text-base px-3 2xl:px-6 py-2 2xl:py-3 font-medium",
  printOrSave: "text-xs 2xl:text-base p-1 font-medium",
};

const buttonVariants = {
  primary:
    "text-white bg-blue-600 hover:bg-blue-700 active:scale-95  w-xl disabled:bg-gray-400 disabled:cursor-not-allowed",
  secondary:
    "text-gray-600 bg-gray-100 border md:border-gray-300 border-gray-200 hover:bg-gray-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed",
  secondaryShiftRD:
    "text-gray-600 bg-green-500 border border-geen-500 hover:bg-green-300 hover:border-green-300 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed",
  secondaryShiftX:
    "text-gray-600 bg-red-300 border border-red-300 hover:bg-red-200 hover:border-red-200 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed",
  tertiary:
    "text-gray-600 bg-[#FFF144] border border-gray-300 hover:bg-[#FFD01C] active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed",
  danger:
    "text-white bg-red-600 hover:bg-red-700 active:scale-95 w-xl disabled:bg-gray-400 disabled:cursor-not-allowed",
  printOrSave:
    "text-primary-400 border border-none hover:text-primary-600 hover:bg-gray-100 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed hover:cursor-pointer",
};

export default function Button({
  size = "medium",
  variant = "primary",
  children,
  type, // default = button
  ...props
}) {
  // Spinner len ak ide o SUBMIT v pending stave

  return (
    <button
      type={type}
      className={`no-print rounded-md transition-colors duration-200 ${buttonSizes[size]} ${buttonVariants[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}
