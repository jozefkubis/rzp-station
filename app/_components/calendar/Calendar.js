"use client";

import { useCallback, useEffect, useState } from "react";
import { Calendar as BigCalendar, Views } from "react-big-calendar";

import MyButtons from "@/app/_components/calendar/MyButtons";
import MyEvent from "@/app/_components/calendar/MyEvent";
import NewTaskForm from "@/app/_components/calendar/NewTaskForm";
import UpdateTaskForm from "@/app/_components/calendar/UpdateTaskForm";
import Spinner from "@/app/_components/Spinner";
import WarningNotice from "../WarningNotice";
import Modal from "/app/_components/Modal";

import { localizer } from "@/app/_lib/calendarLocalizer";
import { getLocalDateKey } from "@/app/_lib/helpers/functions";
import skHolidays2025 from "@/app/data/sk-holidays-2025.json";

// --------------------------------------------------
// HELPERS
// --------------------------------------------------

function getTodayAtHour(hour) {
  const date = new Date();
  date.setHours(hour, 0, 0, 0);
  return date;
}

// --------------------------------------------------
// UI COMPONENTS
// --------------------------------------------------

// ✅ malý badge pre službu v hlavičke dňa (Month view)
function ShiftDot({ title }) {
  if (!title) return null;

  const bg = title.includes("RD")
    ? "#27ae60"
    : title.includes("PN")
      ? "#c0392b"
      : title.includes("N")
        ? "#2c3e50"
        : title.includes("D")
          ? "#f1c40f"
          : "#64748b";

  return (
    <div
      title={title}
      style={{ backgroundColor: bg }}
      className="ml-1 inline-flex h-[1.1rem] w-[1.1rem] items-center justify-center rounded-full text-[0.55rem] font-semibold text-white"
    >
      {title}
    </div>
  );
}

// --------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------

export default function Calendar({ admin, shiftsAndRequests }) {
  const [events, setEvents] = useState([]);
  const [shiftByDay, setShiftByDay] = useState({});
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draftSlot, setDraftSlot] = useState(null);
  const [showHoliday, setShowHoliday] = useState(false);

  // --------------------------------------------------
  // DATA FETCH
  // --------------------------------------------------

  const fetchEvents = useCallback(async () => {
    setLoading(true);

    // ✅ 1) SLUŽBY → mapované podľa LOKÁLNEHO dňa
    const map = {};

    for (const shift of shiftsAndRequests) {
      const raw = shift.date;

      const key =
        raw instanceof Date ? getLocalDateKey(raw) : String(raw).slice(0, 10); // "YYYY-MM-DD..."

      map[key] = shift.shift;
    }

    setShiftByDay(map);

    // ✅ 2) ÚLOHY
    const data = await fetch("/api/tasks").then((res) => res.json());

    const userEvents = data.map((task) => ({
      id: task.id,
      title: task.title,
      start: task.startTime
        ? new Date(`${task.dateFrom}T${task.startTime}`)
        : new Date(`${task.dateFrom}T00:00:00`),
      end: task.endTime
        ? new Date(`${task.dateTo}T${task.endTime}`)
        : new Date(`${task.dateFrom}T00:00:00`),
      allDay: !task.startTime && !task.endTime,
      isAllDay: !task.startTime && !task.endTime,
      note: task.note,
    }));

    // ✅ 3) SVIATKY
    const holidayEvents = skHolidays2025.map((h) => ({
      id: "hol-" + h.date,
      title: h.localName,
      start: new Date(`${h.date}T00:00:00`),
      end: new Date(`${h.date}T00:00:00`),
      allDay: true,
      isHoliday: true,
    }));

    setEvents([...userEvents, ...holidayEvents]);
    setLoading(false);
  }, [shiftsAndRequests]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // --------------------------------------------------
  // HANDLERS
  // --------------------------------------------------

  function handleSelectEvent(event) {
    setSelectedEvent(event);
    setIsOpenModal(true);
  }

  function handleSelectSlot({ start, end }) {
    setSelectedEvent(null);
    setDraftSlot({ start, end });
    setIsOpenModal(true);
  }

  // --------------------------------------------------
  // CALENDAR CONFIG
  // --------------------------------------------------

  const messages = {
    previous: "Späť",
    next: "Ďalej",
    today: "Dnes",
    month: "Mesiac",
    week: "Týždeň",
    day: "Deň",
    agenda: "Prehľad",
    allDay: "Celý deň",
    isAllDay: "Celý deň",
    dateFrom: "Dátum od",
    dateTo: "Dátum do",
    time: "Čas",
    event: "Udalosť",
    showMore: (total) => `+ ďalších ${total}`,
  };

  const eventPropGetter = useCallback(
    (event) => {
      // urgentné
      if (event.title && event.title.includes("!")) {
        return {
          style: {
            backgroundColor: "#F21905",
            color: "white",
          },
        };
      }

      // sviatky
      if (event.isHoliday) {
        const base = {
          backgroundColor: "#FFF144",
          border: "none",
          color: "#525759",
          display: showHoliday ? "none" : "",
        };

        if (view !== Views.AGENDA) {
          base.margin = "1px";
          base.borderLeft = "12px solid #FFD01C";
        }

        return { style: base };
      }

      return {};
    },
    [view, showHoliday],
  );

  function dayPropGetter(date) {
    const isWeekend = [0, 6].includes(date.getDay()); // nedeľa=0, sobota=6
    return {
      className: isWeekend ? "bg-amber-100" : "",
    };
  }

  // ✅ HLAVIČKA DŇA – opravený LOKÁLNY dátum
  const MonthDateHeader = useCallback(
    ({ date, label }) => {
      const key = getLocalDateKey(date);
      const shiftTitle = shiftByDay[key];

      return (
        <div className="flex items-center justify-between">
          <span>{label}</span>
          <ShiftDot title={shiftTitle} />
        </div>
      );
    },
    [shiftByDay],
  );

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="grid h-full w-full grid-cols-1 md:relative md:h-[85dvh] md:grid-cols-[auto_1fr] md:gap-2">
      <MyButtons
        setSelectedEvent={setSelectedEvent}
        setDraftSlot={setDraftSlot}
        setIsOpenModal={setIsOpenModal}
        setShowHoliday={setShowHoliday}
        showHoliday={showHoliday}
      />

      <div>
        {loading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-white/70">
            <Spinner />
          </div>
        )}

        <BigCalendar
          culture="sk"
          localizer={localizer}
          events={events}
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          selectable
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          messages={messages}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor="note"
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          min={getTodayAtHour(6)}
          max={getTodayAtHour(23)}
          scrollToTime={getTodayAtHour(6)}
          step={30}
          timeslots={2}
          style={{ height: "100%" }}
          components={{
            event: MyEvent,
            month: {
              dateHeader: MonthDateHeader,
            },
          }}
        />
      </div>

      {isOpenModal && (
        <Modal
          onClose={() => {
            setIsOpenModal(false);
            setSelectedEvent(null);
          }}
        >
          {admin === "ÁNO" ? (
            selectedEvent ? (
              <UpdateTaskForm
                task={selectedEvent}
                onClose={() => {
                  setIsOpenModal(false);
                  setSelectedEvent(null);
                  setDraftSlot(null);
                }}
                refresh={fetchEvents}
              />
            ) : (
              <NewTaskForm
                slot={draftSlot}
                onClose={() => {
                  setIsOpenModal(false);
                  setSelectedEvent(null);
                  setDraftSlot(null);
                }}
                refresh={fetchEvents}
              />
            )
          ) : (
            <WarningNotice />
          )}
        </Modal>
      )}
    </div>
  );
}
