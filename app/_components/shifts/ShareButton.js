"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "../Button";

function ShareButton({
    shareUrl,
    title = "Rozpis služieb",
    monthLabel,
    year,
    stationName = "RZP Rajec",
}) {
    const [isSharing, setIsSharing] = useState(false);

    async function handleShare() {
        // 1) zistíme URL – buď príde z props, alebo aktuálna
        const url = shareUrl ?? window.location.href;

        // 2) poskladáme celú správu, ktorá sa skopíruje do schránky
        const shareMessage = `
${title} – ${monthLabel ?? ""} ${year ?? ""}
Stanica: ${stationName}

Otvoriť rozpis:
${url}
`.trim();

        try {
            setIsSharing(true);

            // 🔹 Ak je dostupné Web Share API, môžeme to skúsiť ako natívne zdieľanie
            if (navigator.share) {
                await navigator.share({
                    title,
                    text: shareMessage,
                    url,
                });
                // ak user zdieľanie zruší, neháčeme error
                return;
            }

            // 🔹 Fallback: skopírujeme celé shareMessage do schránky
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(shareMessage);
                toast.success("Text správy skopírovaný, stačí vložiť do Messengeru/Gmailu 👍");
            } else {
                // úplne primitívny fallback
                const textarea = document.createElement("textarea");
                textarea.value = shareMessage;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
                toast.success("Text správy skopírovaný, stačí vložiť do Messengeru/Gmailu 👍");
            }
        } catch (err) {
            if (err?.name !== "AbortError") {
                console.error(err);
                toast.error("Nepodarilo sa pripraviť správu na zdieľanie");
            }
        } finally {
            setIsSharing(false);
        }
    }

    return (
        <div className="flex">
            <Button
                variant="printOrSave"
                size="printOrSave"
                type="button"
                onClick={handleShare}
                disabled={isSharing}
            >
                <Share2 className="h-5 w-5 " />
            </Button>
        </div>
    );
}

export default ShareButton;
