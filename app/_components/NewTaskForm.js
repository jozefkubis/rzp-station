"use client";

import { useEffect, useState } from "react";
import FormTaskInput from "./FormTaskInput";
import Button from "./Button";
import toast from "react-hot-toast";
import handleSubmitNewTask from "../_lib/functions/handleSubmitNewTask";
import ToggleSwitch from "./ToggleSwitch";

export default function NewTaskForm({ onClose, refresh, slot }) {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [note, setNote] = useState("");
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const [isAllDay, setIsAllDay] = useState(false);

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    useEffect(() => {
        if (isAllDay) {
            setDateTo("");
            setStartTime("");
            setEndTime("");
        } else if (!dateTo) {
            setDateTo(dateFrom);
        }
    }, [isAllDay, dateFrom, dateTo]);

    useEffect(() => {
        if (!slot) return; // kliknutie na „+“ nemá slot
        function toDateInputStr(date) {
            const tzDiff = date.getTimezoneOffset() * 60000; // min → ms
            const local = new Date(date.getTime() - tzDiff); // posun späť na lokál
            return local.toISOString().slice(0, 10); // 'YYYY-MM-DD'
        }
        setDateFrom(toDateInputStr(slot.start));
    }, [slot]);

    const todayStr = new Date().toISOString().slice(0, 10);


    async function handleSubmit(e) {
        e.preventDefault();
        handleSubmitNewTask(e, {
            setError,
            onClose,
            refresh,
        });
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Názov udalosti */}
            <FormTaskInput
                label="Názov udalosti"
                id="title"
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <div className="flex items-center justify-between border-b border-t border-primary-50 px-4 py-3">
                <span className="font-semibold text-primary-700">Celý deň</span>
                <ToggleSwitch
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    name="isAllDay"
                />
            </div>

            {/* Riadok “Od” */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormTaskInput
                    label="Dátum od"
                    id="date_from"
                    type="date"
                    name="dateFrom"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    min={todayStr}
                    required
                />
                <FormTaskInput
                    label="Čas od"
                    id="startTime"
                    type="time"
                    name="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    disabled={isAllDay}
                />
            </div>

            {/* Riadok “Do” */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormTaskInput
                    label="Dátum do"
                    id="date_to"
                    type="date"
                    name="dateTo"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    min={todayStr}
                    disabled={isAllDay}
                // required
                />
                <FormTaskInput
                    label="Čas do"
                    id="endTime"
                    type="time"
                    name="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    disabled={isAllDay}
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
                    className="rounded-md border bg-gray-50 px-4 py-2 text-primary-700 outline-none focus:ring-2 focus:ring-primary-300"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                // required
                />
            </div>

            {/* Tlačidlo */}
            <div className="flex justify-end">
                <Button variant="primary" size="large" type="submit">
                    Pridať
                </Button>
            </div>
        </form>
    );
}
