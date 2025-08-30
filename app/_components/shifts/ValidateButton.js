"use client";

import { validateShifts } from "@/app/_lib/actions"; // server action
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import { MONTHS } from "./helpers_shifts";

// malé helpery len pre UI
const fmtSk = new Intl.DateTimeFormat("sk-SK", {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});
const isoToSk = (iso) => fmtSk.format(new Date(iso));

function monthYearFromOffset(baseDate, offset) {
    const d = new Date(baseDate.getFullYear(), baseDate.getMonth() + offset, 1);
    return { year: d.getFullYear(), month1: d.getMonth() + 1 };
}

export default function ValidateButton() {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [result, setResult] = useState(null);

    const searchParams = useSearchParams();
    const urlOffset = searchParams.get("m") ?? "0";
    const offset = Number(urlOffset);

    // lokálny odhad (iba pre úvodný titulok kým nemáme result)
    const today = useMemo(() => new Date(), []);
    const { year: guessYear, month1: guessMonth1 } = useMemo(
        () => monthYearFromOffset(today, offset),
        [today, offset],
    );

    // titulok mesiaca:
    const base = new Date();
    const date = new Date(base.getFullYear(), base.getMonth() + offset, 1);

    const year = date.getFullYear();
    const mIndex = date.getMonth(); // 0-based (0=Január)
    const monthName = MONTHS()[mIndex]; // pekne slovensky názov mesiaca

    const monthLabel =
        monthName.charAt(0).toUpperCase() + monthName.slice(1).toLowerCase();


    async function handleValidate() {
        setIsValidating(true);
        const res = await validateShifts(offset); // server action
        setResult(res);
        setIsValidating(false);
    }

    function handleOpenModal() {
        setIsOpenModal(true);
        handleValidate(); // spusti hneď po otvorení
    }

    return (
        <>
            <div>
                <Button variant="secondary" onClick={handleOpenModal}>
                    Skontrolovať pokrytie
                </Button>
            </div>

            {isOpenModal && (
                <Modal onClose={() => setIsOpenModal(false)}>
                    <div className="space-y-4">
                        <h2 className="text-lg text-primary-700 font-semibold">
                            Výsledok kontroly ({monthLabel} {year})
                        </h2>


                        {isValidating && <p className="text-primary-500">Kontrolujem…</p>}

                        {!isValidating && result?.error && (
                            <p className="text-red-600">Chyba: {result.error}</p>
                        )}

                        {!isValidating && result?.ok && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600 text-[1.1rem]">
                                    Rozsah: {isoToSk(result.range.from)} → {isoToSk(result.range.to)} • Chyby:{" "}
                                    {result.summary.totalIssues}
                                </p>

                                <div className="max-h-[50vh] text-primary-700 overflow-y-auto border rounded">
                                    <table className="w-full text-[1.2rem]">
                                        <thead className="bg-gray-50 sticky top-0">
                                            <tr>
                                                <th className="border px-2 py-1 text-left">Dátum</th>
                                                <th className="border px-2 py-1">D</th>
                                                <th className="border px-2 py-1">N</th>
                                                <th className="border px-2 py-1 text-left">Upozornenia</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {result.days.map((d) => {
                                                const hasError = d.issues.some((i) => i.level === "error");
                                                return (
                                                    <tr
                                                        key={d.date}
                                                        className={hasError ? "bg-red-50" : undefined} // voliteľné zvýraznenie
                                                    >
                                                        <td className="border px-2 py-1 font-mono">
                                                            <div className="whitespace-nowrap">{isoToSk(d.date)}</div>
                                                        </td>
                                                        <td className="border px-2 py-1 text-center">
                                                            {d.counts.D} / {d.coverage.D}
                                                        </td>
                                                        <td className="border px-2 py-1 text-center">
                                                            {d.counts.N} / {d.coverage.N}
                                                        </td>
                                                        <td className="border px-2 py-1">
                                                            {d.issues.length === 0 ? (
                                                                <span className="text-emerald-600">OK</span>
                                                            ) : (
                                                                <ul className="list-disc pl-5 space-y-1">
                                                                    {d.issues.map((i, idx) => (
                                                                        <li
                                                                            key={idx}
                                                                            className={i.level === "error" ? "text-red-600" : "text-amber-600"}
                                                                            title={i.code}
                                                                        >
                                                                            {i.message}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={() => setIsOpenModal(false)}>Zavrieť</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    );
}
