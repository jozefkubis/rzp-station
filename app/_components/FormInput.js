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
  accept
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className=" text-white font-bold text-lg">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        className={`hover:cursor-pointer mt-1 px-4 py-2 border w-full rounded-md focus:ring-2 focus:ring-primary-500 text-md  focus:outline-none ${disabled ? "bg-primary-50" : "bg-primary-50 font-semibold text-primary-700"
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
  )
}
