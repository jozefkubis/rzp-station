"use client";
import { useState, useEffect } from "react";
import { Calendar as BigCalendar, Views } from "react-big-calendar";
import { localizer } from "../_lib/calendarLocalizer";
import Spinner from "./Spinner";
import MyEvent from "./MyEvent";

export default function Calendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/tasks")
            .then(r => r.json())
            .then(data => {
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
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="relative h-[80vh]">
            {loading && (
                <div className="absolute inset-0 z-10 grid place-items-center bg-white/70">
                    <Spinner />
                </div>
            )}
            <BigCalendar
                localizer={localizer}
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
    );
}
