"use client";

import MyButtons from "@/app/_components/calendar/MyButtons";
import MyEvent from "@/app/_components/calendar/MyEvent";
import NewTaskForm from "@/app/_components/calendar/NewTaskForm";
import UpdateTaskForm from "@/app/_components/calendar/UpdateTaskForm";
import Spinner from "@/app/_components/Spinner";
import { localizer } from "@/app/_lib/calendarLocalizer";
import skHolidays2025 from "@/app/data/sk-holidays-2025.json";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Calendar as BigCalendar, Views } from "react-big-calendar";
import WarningNotice from "../WarningNotice";
import Modal from "/app/_components/Modal";

export default function Calendar({ admin, shiftsAndRequests }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [draftSlot, setDraftSlot] = useState(null);
  const [showHoliday, setShowHoliday] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
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

    const shiftEvents = shiftsAndRequests.map((shift) => ({
      id: "shift-" + shift.id,
      // title: `${shift.shift} ${shift.request}`,
      title: shift.shift,
      start: new Date(shift.date),
      end: new Date(shift.date),
      allDay: true,
      isShift: true,
    }));

    const holidayEvents = skHolidays2025.map((h) => ({
      id: "hol-" + h.date,
      title: h.localName,
      start: new Date(h.date + "T00:00:00"),
      end: new Date(h.date + "T00:00:00"),
      allDay: true,
      isHoliday: true,
    }));

    setEvents([...userEvents, ...holidayEvents, ...shiftEvents]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  function handleSelectEvent(e) {
    setSelectedEvent(e);
    setIsOpenModal(true);
  }

  function handleSelectSlot({ start, end }) {
    setSelectedEvent(null);
    setDraftSlot({ start, end });
    setIsOpenModal(true);
  }

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
      if (event.isShift) {
        // 1️⃣ Ak chýba title
        if (!event.title) {
          return {
            style: {
              backgroundColor: "transparent",
              // border: "none",
            },
          };
        }

        // 2️⃣ Denná
        if (event.title.includes("D")) {
          return {
            style: {
              backgroundColor: "transparent",
              // backgroundColor: "#f1c40f",
              border: "none",
              // color: "#2c3e50",
              // color: "white",
              borderRadius: "9999px",
            },
          };
        }

        // 3️⃣ Nočná
        if (event.title.includes("N")) {
          return {
            style: {
              backgroundColor: "transparent",
              // backgroundColor: "#2c3e50",
              // border: "none",
              // color: "white",
              color: "#2c3e50",
            },
          };
        }

        // 4️⃣ Iné typy (napr. RD, PN, OČR)
        return {
          style: {
            backgroundColor: "transparent",
            // backgroundColor: "#FFD01C",
            // border: "none",
            // color: "white",
            color: "#2c3e50",
          },
        };
      }

      // urgentné
      if (event.title.includes("!")) {
        return {
          style: {
            backgroundColor: "#F21905",
            // border: "none",
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
          fontSize: "0.75rem",
          fontWeight: 500,
          display: showHoliday ? "none" : "",
        };

        // ⚠️ len mimo Agenda pridaj ľavý pruh + margin
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

  // MARK: RENDER....................................................

  return (
    <div
      data-cy="calendar-page"
      className="grid h-full w-full grid-cols-1 md:relative md:h-[85dvh] md:grid-cols-[auto_1fr] md:gap-2"
    >
      <MyButtons
        setSelectedEvent={setSelectedEvent}
        setDraftSlot={setDraftSlot}
        setIsOpenModal={setIsOpenModal}
        setShowHoliday={setShowHoliday}
        showHoliday={showHoliday}
      />

      <div data-cy="calendar-wrapper">
        {loading && (
          <div
            data-cy="calendar-spinner"
            className="absolute inset-0 z-10 grid place-items-center bg-white/70"
          >
            <Spinner />
          </div>
        )}
        <BigCalendar
          culture="sk"
          view={view}
          date={date}
          onView={setView}
          onNavigate={setDate}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          localizer={localizer}
          messages={messages}
          formats={{
            // úplné názvy dní v týždni v hlavičke
            weekdayFormat: (date, culture, localizer) =>
              localizer.format(date, "EEEE", culture),
            // názov mesiaca s rokom
            monthHeaderFormat: (date, culture, localizer) =>
              localizer.format(date, "LLLL yyyy", culture),
            // formát hlavičky pri prepnutí na day view
            dayHeaderFormat: (date, culture, localizer) =>
              localizer.format(date, "EEEE, dd.MM.yyyy", culture),
          }}
          events={events}
          eventPropGetter={eventPropGetter}
          dayPropGetter={dayPropGetter}
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          startAccessor="start"
          endAccessor="end"
          tooltipAccessor="note"
          style={{ height: "100%" }}
          components={{
            event: MyEvent,
          }}
          min={moment().startOf("day").hour(6).toDate()}
          max={moment().startOf("day").hour(23).toDate()}
          scrollToTime={moment().startOf("day").hour(6).toDate()}
          step={30}
          timeslots={2}
        />
      </div>

      {isOpenModal && (
        <div data-cy="calendar-modal">
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
        </div>
      )}
    </div>
  );
}
