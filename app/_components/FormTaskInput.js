export default function FormTaskInput({ label, id, className = "", ...rest }) {
    return (
        <div className="grid gap-2">
            {label && (
                <label htmlFor={id} className="font-semibold text-primary-700">
                    {label}
                </label>
            )}
            <input
                id={id}
                {...rest}
                className={`
          w-full rounded-md border bg-gray-50 px-4 py-2 text-primary-700
          focus:outline-none focus:ring-2 focus:ring-primary-300
          ${rest.disabled ? "opacity-50" : ""}
          ${className}
        `}
            />
        </div>
    );
}
