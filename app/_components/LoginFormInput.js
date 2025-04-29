export default function LoginFormInput({
    // label,
    id,
    className = "",
    ...rest
}) {
    return (
        <div className="flex flex-col">
            {/* {label && (
                <label htmlFor={id} className="text-lg font-bold text-primary-700 flex">
                    {label}
                </label >
            )
            } */}

            <input
                id={id}
                className={`text-lg w-full rounded-md border px-5 py-3 text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 ${rest.disabled ? "bg-primary-50" : "bg-gray-50 font-semibold"
                    } ${className}`}
                {...rest}
            />
        </div >
    );
}
