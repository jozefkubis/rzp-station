"use client";

import { useState, useEffect } from "react";
import { Calendar as BigCalendar, Views } from "react-big-calendar";
import { localizer } from "../_lib/calendarLocalizer";

export default function Calendar() {
    // const [events, setEvents] = useState([]);
    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     async function fetchEvents() {
    //         setLoading(true);
    //         const res = await fetch("/api/tasks");    // prispôsob URL tvojmu endpointu
    //         const data = await res.json();            // očakávaj pole { id, title, date, startTime?, endTime? }
    //         const evts = data.map((t) => ({
    //             id: t.id,
    //             title: t.title,
    //             start: new Date(t.startTime || t.date),
    //             end: new Date(t.endTime || t.date),
    //             allDay: !t.startTime,
    //         }));
    //         setEvents(evts);
    //         setLoading(false);
    //     }
    //     fetchEvents();
    // }, []);

    // if (loading) {
    //     return <p className="text-center py-10">Nahrávam kalendár…</p>;
    // }

    return (
        <div className="h-[80vh]">
            <BigCalendar
                localizer={localizer}
                // events={events}
                defaultView={Views.MONTH}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
            />
        </div>
    );
}
