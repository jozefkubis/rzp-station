
export default function FormSelect({
  label,
  id,
  name,
  options = [],
  value = "",
  onChange,
  required = false,
  className = "",
}) {

  return (
    <div className="grid grid-cols-2 items-center border-t border-gray-200 px-4 py-3">
      <div>
        {label && (
          <label htmlFor={id} className="text-md font-bold text-primary-700 flex">
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
          className={`text-md w-full rounded-md border px-4 py-2 text-primary-700 bg-gray-50 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-300 hover:cursor-pointer ${className}`}
        >
          <option value="" disabled>— Vyber pozíciu —</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );
} ``
