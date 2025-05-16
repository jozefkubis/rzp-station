"use client";

import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import Button from "./Button";
import toast from "react-hot-toast";
import handleSubmitUpdateTaskForm from "../_lib/functions/handleSubmitUpdateTaskForm";
import DeleteTaskButton from "./DeleteTaskButton";


export default function UpdateTaskForm({ onClose, refresh, task }) {
    function toDateInputStr(date) {
        const tzDiff = date.getTimezoneOffset() * 60000;      // min → ms
        const local = new Date(date.getTime() - tzDiff);     // posun späť na lokál
        return local.toISOString().slice(0, 10);              // 'YYYY-MM-DD'
    }

    function toTimeInputStr(date) {
        return date.toTimeString().slice(0, 5);               // 'HH:mm'
    }

    const [dateFrom, setDateFrom] = useState(toDateInputStr(task.start));
    const [dateTo, setDateTo] = useState(toDateInputStr(task.end));
    const [startTime, setStartTime] = useState(toTimeInputStr(task.start));
    const [endTime, setEndTime] = useState(toTimeInputStr(task.end));
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
        <>
            <form data-cy="new-task-form" onSubmit={handleSubmit} className="">

                <input
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
                        min={new Date().toISOString().slice(0, 10)}
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

                <div className="flex justify-end p-5 gap-2">
                    {/* vymazanie – vľavo (alebo zmeň poradie podľa chuti) */}
                    <DeleteTaskButton
                        task={task}
                        onClose={onClose}
                        refresh={refresh}
                    />

                    {/* update – vpravo */}
                    <Button variant="primary" size="large" type="submit">
                        Aktualizovať
                    </Button>
                </div>

            </form>
            {/* <div className="flex justify-center">
                <DeleteTaskButton task={task} onClose={onClose} refresh={refresh} />
            </div> */}
        </>
    )
}