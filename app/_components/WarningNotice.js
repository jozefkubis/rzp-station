function WarningNotice() {
    return (
        <div className="flex flex-col items-center justify-center">
            <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary-700 text-white shadow-inner">
                <svg
                    aria-hidden="true"
                    className="h-18 w-18 p-2"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                >
                    <path d="M12 8v5" />
                    <path d="M12 17h.01" />
                    <path d="M10.29 3.86 2.82 17a2 2 0 0 0 1.71 3h14.94a2 2 0 0 0 1.71-3l-7.47-13.14a2 2 0 0 0-3.42 0Z" />
                </svg>
            </span>
            <h1 className="mt-6 text-3xl font-semibold text-primary-700">
                Do vybranej zložky nemáš prístup!
            </h1>
        </div>

    );
}

export default WarningNotice;