function ToggleSwitch({ checked, onChange, name, value }) {
    return (
        <label className="relative inline-block h-[28px] w-[54px]">
            {/* checkbox je „peer“, aby sme cezňho menili štýly span-u */}
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="peer sr-only focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

            {/* slider */}
            <span className="absolute inset-0 cursor-pointer rounded-full bg-gray-300 transition-colors duration-300 before:absolute before:bottom-1 before:left-2 before:h-[20px] before:w-[20px] before:rounded-full before:bg-white before:transition-transform before:duration-300 before:content-[''] peer-checked:bg-blue-600 peer-checked:before:translate-x-[20px]" />
        </label>
    );
}

export default ToggleSwitch;
