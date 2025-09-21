import { useId } from "react";

/** Univerzálny select v štýle FormInput */
export default function FormSelect({
  label,
  id,
  name,
  options = [],
  placeholder = "— Vyberte —",
  value,
  onChange,
  required = false,
  disabled = false,
  className = "",
  ...rest
}) {
  const selectId = id ?? useId();

  // dovolí options ako ["A","B"] alebo [{value:"A", label:"Áčko"}]
  const normalized = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt,
  );

  return (
    <div className="grid grid-cols-2 items-center border-t border-gray-200 px-4 py-3">
      <div>
        {label && (
          <label
            htmlFor={selectId}
            className="text-md flex font-bold text-primary-700"
          >
            {label}
          </label>
        )}
      </div>

      <div>
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          required={required}
          disabled={disabled}
          className={`text-md w-full rounded-md border px-4 py-2 text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 ${
            disabled
              ? "cursor-not-allowed bg-primary-50"
              : "bg-gray-50 font-semibold hover:cursor-pointer"
          } ${className}`}
          {...rest}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {normalized.map(({ value, label, disabled }) => (
            <option key={String(value)} value={value} disabled={disabled}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
