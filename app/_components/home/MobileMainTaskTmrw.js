
function MobileMainTasks({ dayData, dateString, label, tasks }) {

    const boxContent = tasks.map((task, i) => (
        <li key={i} className="flex items-center gap-2">
            {i + 1}. {task}
        </li>
    ));

    const localDate = new Date(dateString).toLocaleDateString("sk-SK", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    return (
        <div className="flex flex-col bg-white px-4 p-8 gap-2">
            <div>
                {label && (
                    <h5 className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary-600">
                        {label}: {localDate}
                    </h5>
                )}
            </div>
            <div className="flex flex-col gap-2 text-lg font-medium text-primary-600">
                {boxContent.length ? boxContent : "Žiadne úlohy"}
            </div>
        </div>
    )
}

export default MobileMainTasks
