"use client";

import { useEffect, useState } from "react";
import FormTaskInput from "./FormTaskInput";
import Button from "./Button";
import toast from "react-hot-toast";
import handleSubmitUpdateTaskForm from "../_lib/functions/handleSubmitUpdateTaskForm";
import DeleteTaskButton from "./DeleteTaskButton";

export default function UpdateTaskForm({ onClose, refresh, task }) {

    const toDateStr = d =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
            d.getDate()
        ).padStart(2, "0")}`;

    const toTimeStr = d => d.toTimeString().slice(0, 5);

    const [dateFrom, setDateFrom] = useState(toDateStr(task.start));
    const [dateTo, setDateTo] = useState(toDateStr(task.end));
    const [startTime, setStartTime] = useState(toTimeStr(task.start));
    const [endTime, setEndTime] = useState(toTimeStr(task.end));
    const [note, setNote] = useState(task.note ?? "");
    const [title, setTitle] = useState(task.title);
    const [error, setError] = useState("");

    useEffect(() => { if (error) toast.error(error); }, [error]);

    async function handleSubmit(e) {
        await handleSubmitUpdateTaskForm(e, { setError, onClose, refresh });
    }


    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <input type="hidden" name="id" value={task.id} />

            {/* Názov */}
            <FormTaskInput
                label="Názov udalosti"
                id="title"
                type="text"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
            />

            {/* Riadok Od */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormTaskInput
                    label="Dátum od"
                    id="date_from"
                    type="date"
                    name="dateFrom"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    required
                />
                <FormTaskInput
                    label="Čas od"
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                />
            </div>

            {/* Riadok Do */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormTaskInput
                    label="Dátum do"
                    id="date_to"
                    type="date"
                    name="dateTo"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                // required
                />
                <FormTaskInput
                    label="Čas do"
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                />
            </div>

            {/* Poznámka */}
            <div className="grid gap-2">
                <label htmlFor="note" className="font-semibold text-primary-700">
                    Poznámka
                </label>
                <textarea
                    id="note"
                    name="note"
                    rows="3"
                    className="rounded-md border bg-gray-50 px-4 py-2 text-primary-700 focus:ring-2 focus:ring-primary-300 outline-none"
                    value={note ?? ""}
                    onChange={e => setNote(e.target.value)}
                // required
                />
            </div>

            {/* Tlačidlá */}
            <div className="flex justify-end gap-2">
                <DeleteTaskButton task={task} onClose={onClose} refresh={refresh} />
                <Button variant="primary" size="large" type="submit">
                    Aktualizovať
                </Button>
            </div>
        </form>
    );
}
