import { getTasksForToday, getTasksForTomorrow } from "@/app/_lib/data-service";
import { CalendarDivRow, CalendarHeaderRow, CalendarMainRow, CalendarPRow } from "./CalendarRow";
import { IoCalendarOutline } from "react-icons/io5";

export default async function CalendarToday() {
  const tasksForToday = await getTasksForToday();
  const taskTitleForToday = tasksForToday.map((task) => task.title);
  const taskForTmrw = await getTasksForTomorrow();
  const taskTitleForTmrw = taskForTmrw.map((task) => task.title);

  return (
    <section className="w-full rounded-2xl bg-white p-8 shadow text-primary-700">
      <CalendarMainRow>
        <CalendarDivRow>
          <CalendarHeaderRow><IoCalendarOutline /> Kalendár dnes</CalendarHeaderRow>
          <CalendarPRow>{taskTitleForToday}</CalendarPRow>
        </CalendarDivRow>

        {/* <div className="my-2 h-px bg-slate-200" /> */}
        <CalendarDivRow>
          <CalendarHeaderRow><IoCalendarOutline /> Kalendár zajtra</CalendarHeaderRow>
          <CalendarPRow>{taskTitleForTmrw}</CalendarPRow>
        </CalendarDivRow>
      </CalendarMainRow>
    </section>
  );
}
