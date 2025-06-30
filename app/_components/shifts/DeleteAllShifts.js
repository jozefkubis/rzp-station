"use client";

import Button from "../Button";
import { clearMonth } from "@/app/_lib/actions";
// import { useRouter } from "next/navigation";

export default function DeleteAllShifts() {
    // const router = useRouter();

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;

    async function handleClearMonth() {
        if (!confirm("Naozaj vymazať všetky služby v aktuálnom mesiaci?")) return;
        await clearMonth(year, month);
        // router.refresh();
    }

    return (
        <div className="mt-6 self-start 2xl:px-32">
            <Button variant="danger" onClick={handleClearMonth}>
                🧹 Vymaž celý mesiac
            </Button>
        </div>
    )

}