"use client";

import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import toast from "react-hot-toast";
import handleSubmitNewTask from "../_lib/functions/handleSubmitNewTask";


export default function NewTaskForm({ onClose, refresh }) {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [note, setNote] = useState("");
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    async function handleSubmit(e) {
        handleSubmitNewTask(e, { setError, onClose, refresh });
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
                    label="Dátum"
                    id="date"
                    type="date"
                    name="date"
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
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
                    Pridať
                </Button>
            </div>

        </form>
    )
}