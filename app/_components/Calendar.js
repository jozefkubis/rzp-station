"use client";

import { useState, useEffect, useCallback } from "react";
import { Calendar as BigCalendar, Views } from "react-big-calendar";
import { localizer } from "../_lib/calendarLocalizer";
import Spinner from "./Spinner";
import MyEvent from "./MyEvent";
import Button from "./Button";
import NewTaskForm from "./NewTaskForm";
import UpdateTaskForm from "./UpdateTaskForm";
import Modal from "./Modal";
import moment from 'moment';

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [draftSlot, setDraftSlot] = useState(null);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        const data = await fetch("/api/tasks").then(res => res.json());
        setEvents(data.map(task => ({
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
            note: task.note
        })));
        setLoading(false);
    }, []);
    useEffect(() => { fetchEvents() }, [fetchEvents]);

    function handleSelectEvent(e) {
        setSelectedEvent(e);
        setIsOpenModal(true);
    };

    function handleSelectSlot({ start, end }) {
        setSelectedEvent(null);
        setDraftSlot({ start, end });
        setIsOpenModal(true);
    };


    const messages = {
        previous: 'Späť',
        next: 'Ďalej',
        today: 'Dnes',
        month: 'Mesiac',
        week: 'Týždeň',
        day: 'Deň',
        agenda: 'Prehľad',
        allDay: 'Celý deň',
        isAllDay: 'Celý deň',
        dateFrom: 'Dátum od',
        dateTo: 'Dátum do',
        time: 'Čas',
        event: 'Udalosť',

        showMore: (total) => `+ ďalších ${total}`,
    };


    return (
        <div className="relative h-[80vh] grid grid-cols-[auto_1fr] gap-6">
            <div>
                <Button
                    onClick={() => {
                        setSelectedEvent(null);
                        setDraftSlot(null);  // ⇐ vynuluj
                        setIsOpenModal(true);     // otvor modal v režime PRIDAŤ
                    }}
                    size="medium"
                >
                    +
                </Button>
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
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
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
                    views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
                    startAccessor="start"
                    endAccessor="end"
                    tooltipAccessor="note"
                    style={{ height: "100%" }}
                    components={{
                        event: MyEvent,
                    }}
                    min={moment().startOf('day').hour(6).toDate()}
                    max={moment().startOf('day').hour(23).toDate()}
                    scrollToTime={moment().startOf('day').hour(6).toDate()}
                    step={30}
                    timeslots={2}
                />
            </div>

            {isOpenModal && (
                <Modal onClose={() => { setIsOpenModal(false); setSelectedEvent(null); }}>
                    {selectedEvent ? (
                        <UpdateTaskForm
                            task={selectedEvent}
                            onClose={() => { setIsOpenModal(false); setSelectedEvent(null); setDraftSlot(null); }}
                            refresh={fetchEvents}
                        />
                    ) : (
                        <NewTaskForm
                            slot={draftSlot}
                            onClose={() => { setIsOpenModal(false); setSelectedEvent(null); setDraftSlot(null); }}
                            refresh={fetchEvents}
                        />
                    )}
                </Modal>
            )}
        </div>
    );
}
