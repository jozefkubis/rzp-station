export default function FormInput({
  label,
  id,
  className = "",
  ...rest
}) {
  return (
    <div className="grid grid-cols-2">
      <div>
        {label && (
          <label htmlFor={id} className="text-lg font-bold text-primary-700 flex">
            {label}
          </label>
        )}
      </div>

      <div className="">
        <input
          id={id}
          className={`text-md mt-1 w-full rounded-md border px-4 py-2 text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 ${rest.disabled ? "bg-primary-50" : "bg-gray-50 font-semibold"
            } ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
}
