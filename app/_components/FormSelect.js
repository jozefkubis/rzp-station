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
    <div className="grid grid-cols-1 items-center gap-1 px-2 py-3 md:grid-cols-2 md:border-t md:border-gray-200 md:px-4">
      <div>
        {label && (
          <label
            htmlFor={id}
            className="md:text-md flex text-sm font-bold text-primary-700"
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
          className={`md:text-md w-full min-w-full appearance-none rounded-md border bg-gray-50 px-4 py-2 text-sm font-semibold text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 ${className}`}
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
