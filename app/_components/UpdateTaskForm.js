"use client";

import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import toast from "react-hot-toast";
import handleSubmitUpdateTaskForm from "../_lib/functions/handleSubmitUpdateTaskForm";


export default function NewTaskForm({ onClose, refresh, task }) {
    const toDateStr = d => d.toISOString().slice(0, 10);   // '2025-05-20'
    const toTimeStr = d => d.toISOString().slice(11, 16);  // '09:15'

    const [dateFrom, setDateFrom] = useState(toDateStr(task.start));
    const [dateTo, setDateTo] = useState(toDateStr(task.end));
    const [startTime, setStartTime] = useState(toTimeStr(task.start));
    const [endTime, setEndTime] = useState(toTimeStr(task.end));
    const [note, setNote] = useState(task.note);
    const [title, setTitle] = useState(task.title);
    const [error, setError] = useState("");

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    async function handleSubmit(e) {
        handleSubmitUpdateTaskForm(e, { setError, onClose, refresh });
    }

    return (
        <form data-cy="new-task-form" onSubmit={handleSubmit} className="">

            <FormInput
                id="id"
                type="hidden"
                name="id"
                value={task.id}
            />

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
                    min={
                        new Date(new Date().setDate(new Date().getDate()))
                            .toISOString()
                            .split("T")[0]
                    }
                    required
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
                    min={
                        new Date(new Date().setDate(new Date().getDate()))
                            .toISOString()
                            .split("T")[0]
                    }
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
                <label htmlFor="note" className="text-md font-bold text-primary-700 flex">
                    Poznámka
                </label>
                <textarea
                    id="note"
                    rows="3"
                    name="note"
                    onChange={(e) => setNote(e.target.value)}
                    value={note}
                    className="text-md w-full rounded-md border px-4 py-2 text-primary-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50 font-semibold"
                    required
                ></textarea>
            </div>

            <div className="flex justify-end p-5">
                <Button variant="primary" size="large">
                    Aktualizovať
                </Button>
            </div>

        </form>
    )
}