import { getTasksForToday, getTasksForTomorrow } from "@/app/_lib/data-service";

export default async function CalendarToday() {
  const tasksForToday = await getTasksForToday();
  const taskTitleForToday = tasksForToday.map((task) => task.title);
  const taskForTmrw = await getTasksForTomorrow();
  const taskTitleForTmrw = taskForTmrw.map((task) => task.title);

  return (
    <section className="w-full space-y-2 rounded-2xl bg-white p-4 shadow">
      <h2 className="text-lg font-semibold">Kalendár dnes</h2>
      <p className="text-sm text-gray-600">{taskTitleForToday}</p>

      <h2 className="pt-4 text-lg font-semibold">Kalendár zajtra</h2>
      <p className="text-sm text-gray-600">{taskTitleForTmrw}</p>
    </section>
  );
}
