"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar as BigCalendar, Views } from "react-big-calendar";
import { localizer } from "../_lib/calendarLocalizer";
import Spinner from "./Spinner";
import MyEvent from "./MyEvent";
import Button from "./Button";
import NewTaskForm from "./NewTaskForm";
import Modal from "./Modal";

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [isOpenModal, setIsOpenModal] = useState(false);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        const data = await fetch("/api/tasks").then(r => r.json());
        setEvents(data.map(t => ({
            id: t.id,
            title: t.title,
            start: t.startTime
                ? new Date(`${t.date}T${t.startTime}`)
                : new Date(t.date),
            end: t.endTime
                ? new Date(`${t.date}T${t.endTime}`)
                : new Date(t.date),

            allDay: !t.startTime && !t.endTime,
            note: t.note
        })));
        setLoading(false);
    }, []);
    useEffect(() => { fetchEvents() }, [fetchEvents]);


    const messages = {
        previous: 'Späť',
        next: 'Ďalej',
        today: 'Dnes',
        month: 'Mesiac',
        week: 'Týždeň',
        day: 'Deň',
        agenda: 'Prehľad',
        allDay: 'Celý deň',
        showMore: (total) => `+ ďalších ${total}`,
    };


    return (
        <div className="relative h-[80vh] grid grid-cols-[auto_1fr] gap-6">
            <div>
                <Button onClick={() => setIsOpenModal(true)} size="medium">+</Button>
            </div>

            <div>
                {loading && (
                    <div className="absolute inset-0 z-10 grid place-items-center bg-white/70">
                        <Spinner />
                    </div>
                )}
                <BigCalendar
                    culture="sk"
                    view={view}
                    date={date}
                    onView={setView}
                    onNavigate={setDate}
                    localizer={localizer}
                    messages={messages}
                    formats={{
                        // úplné názvy dní v týždni v hlavičke
                        weekdayFormat: (date, culture, localizer) =>
                            localizer.format(date, 'EEEE', culture),
                        // názov mesiaca s rokom
                        monthHeaderFormat: (date, culture, localizer) =>
                            localizer.format(date, 'LLLL yyyy', culture),
                        // formát hlavičky pri prepnutí na day view
                        dayHeaderFormat: (date, culture, localizer) =>
                            localizer.format(date, 'EEEE, dd.MM.yyyy', culture),
                    }}
                    events={events}
                    defaultView={Views.MONTH}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    startAccessor="start"
                    endAccessor="end"
                    tooltipAccessor="note"
                    style={{ height: "100%" }}
                    components={{
                        event: MyEvent,
                    }}
                />
            </div>

            {isOpenModal && (
                <Modal onClose={() => setIsOpenModal(false)}>
                    <NewTaskForm onClose={() => setIsOpenModal(false)} refresh={fetchEvents} />
                </Modal>
            )}


        </div>
    );
}
