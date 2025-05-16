"use client";

import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import toast from "react-hot-toast";
import handleSubmitNewTask from "../_lib/functions/handleSubmitNewTask";

export default function NewTaskForm({ onClose, refresh, slot }) {
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [note, setNote] = useState("");
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    useEffect(() => {
        if (!slot) return; // kliknutie na „+“ nemá slot

        function toDateInputStr(date) {
            const tzDiff = date.getTimezoneOffset() * 60000; // min → ms
            const local = new Date(date.getTime() - tzDiff); // posun späť na lokál
            return local.toISOString().slice(0, 10); // 'YYYY-MM-DD'
        }
        setDateFrom(toDateInputStr(slot.start));
    }, [slot]);

    async function handleSubmit(e) {
        e.preventDefault();
        handleSubmitNewTask(e, {
            setError,
            onClose,
            refresh,
        });
    }

    return (
        <form data-cy="new-task-form" onSubmit={handleSubmit} className="">
            <div className="flex flex-col">
                <FormInput
                    label="Názov udalosti"
                    id="title"
                    type="text"
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    label="Dátum od"
                    id="date_from"
                    type="date"
                    name="dateFrom"
                    onChange={(e) => setDateFrom(e.target.value)}
                    value={dateFrom}
                    min={new Date().toISOString().slice(0, 10)}
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    label="Čas od"
                    id="startTime"
                    type="time"
                    name="startTime"
                    onChange={(e) => setStartTime(e.target.value)}
                    value={startTime}
                // required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    label="Dátum do"
                    id="date_to"
                    type="date"
                    name="dateTo"
                    onChange={(e) => setDateTo(e.target.value)}
                    value={dateTo}
                    min={new Date().toISOString().slice(0, 10)}
                    required
                />
            </div>

            <div className="flex flex-col">
                <FormInput
                    label="Čas do"
                    id="endTime"
                    type="time"
                    name="endTime"
                    onChange={(e) => setEndTime(e.target.value)}
                    value={endTime}
                // required
                />
            </div>

            <div className="grid grid-cols-2 items-center border-t border-gray-200 px-4 py-3">
                <label
                    htmlFor="note"
                    className="text-md flex font-bold text-primary-700"
                >
                    Poznámka
                </label>
                <textarea
                    id="note"
                    rows="3"
                    name="note"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    className="text-md w-full rounded-md border bg-gray-50 px-4 py-2 font-semibold text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300"
                    required
                ></textarea>
            </div>

            <div className="flex justify-end p-5">
                <Button variant="primary" size="large">
                    Pridať
                </Button>
            </div>
        </form>
    );
}
