export default function FormInput({
  label,
  id,
  type,
  placeholder,
  name,
  required,
  onChange,
  value,
  defaultValue,
  readOnly,
  disabled,
  min,
  max,
  step,
  accept,
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="text-lg font-bold text-white">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`text-md mt-1 w-full rounded-md border px-4 py-2 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 ${
          disabled
            ? "bg-primary-50"
            : "bg-gray-50 font-semibold text-primary-700"
        }`}
        required={required}
        name={name}
        onChange={onChange}
        value={value}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        accept={accept}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
    </div>
  );
}
