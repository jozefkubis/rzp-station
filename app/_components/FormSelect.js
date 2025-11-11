export default function FormSelect({
  label,
  id,
  name,
  options = [],
  value = "",
  onChange,
  required = false,
  className = "",
  placeholder = "— Vyberte —",
  disabled = false,
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-1 px-2 py-2 2xl:py-3 md:grid-cols-2 md:border-t md:border-gray-200 md:px-4">
      <div>
        {label && (
          <label
            htmlFor={id}
            className="text-xs 2xl:text-base flex font-bold text-primary-700"
          >
            {label}
          </label>
        )}
      </div>

      <div>
        <select
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          disabled={disabled}
          className={`text-xs 2xl:text-base w-full min-w-full appearance-none rounded-md border bg-gray-50 px-4 py-2 font-semibold text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 ${className}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
