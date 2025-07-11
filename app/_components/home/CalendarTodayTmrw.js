export default function CalendarToday({ taskTitleForToday, taskTitleForTmrw }) {
  return (
    <section className="w-full space-y-2 rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Kalendár dnes</h2>
      <p className="text-sm text-gray-600">{taskTitleForToday}</p>

      <h2 className="pt-4 text-lg font-semibold">Kalendár zajtra</h2>
      <p className="text-sm text-gray-600">{taskTitleForTmrw}</p>
    </section>
  );
}
