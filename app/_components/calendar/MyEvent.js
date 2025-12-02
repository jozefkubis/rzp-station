export default function MyEvent({ event }) {
  if (event.isShift) {
    const bg = event.title?.includes("RD")
      ? "#27ae60" // RD - zelená
      : event.title?.includes("PN")
        ? "#c0392b" // R - cervená
        : event.title?.includes("N")
          ? "#2c3e50" // N - tmavá
          : event.title?.includes("D")
            ? "#f1c40f" // D - žltá
            : "transparent";

    return (
      <div>
        <div
          style={{ backgroundColor: bg }}
          className="flex h-[1.3rem] w-[1.3rem] items-center justify-center rounded-full text-[0.6rem] font-semibold text-white md:h-[2rem] md:w-[2rem] md:px-2 md:py-2 md:text-[0.9rem]"
        >
          <strong>{event.title}</strong>
        </div>
      </div>
    );
  }

  return (
    <div >
      <strong className="">{event.title}</strong>
      {event.note && (
        <div className="truncate text-xs font-semibold">{event.note}</div>
      )}
    </div>
  );
}
