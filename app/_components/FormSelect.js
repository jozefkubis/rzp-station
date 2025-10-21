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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 items-center border-t border-gray-200 px-2 md:px-4 py-3">
      <div>
        {label && (
          <label
            htmlFor={id}
            className="text-sm md:text-md flex font-semibold md:font-bold text-primary-700"
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
          className={`text-sm md:text-md w-full rounded-md border bg-gray-50 px-4 py-1 md:py-2 font-semibold text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 ${className}`}
        >
          {/* prázdna voľba - validná len ak value === "" */}
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
