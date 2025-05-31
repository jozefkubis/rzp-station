import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { FaRegCalendarPlus } from "react-icons/fa";
import { LuCalendarHeart } from "react-icons/lu";

export default function MyButtons({
    setSelectedEvent,
    setDraftSlot,
    setIsOpenModal,
    showHoliday,
    setShowHoliday,
}) {

    // ----- obslužná funkcia -----
    function handleAdd() {
        setSelectedEvent(null);   // vynuluj vybratú udalosť
        setDraftSlot(null);       // vynuluj "draft" slot
        setIsOpenModal(true);     // otvor modal v režime PRIDAŤ
        console.log("ADD");       // len na debug – môžeš zmazať
    }

    return (
        <div className="flex flex-col gap-2 z-50">
            <TooltipProvider delayDuration={100}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="rounded bg-primary-700 text-gray-50 px-2 py-1"
                            onClick={handleAdd}
                            aria-label="Pridať udalosť"
                            data-cy="calendar-add-event-button"
                        >
                            <FaRegCalendarPlus />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="text-gray-50 bg-primary-700 px-4 py-0 rounded-r-full ml-[-2px] cursor-pointer font-semibold" onClick={handleAdd}>
                        Pridať udalosť
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            data-cy="calendar-toggle-holidays-button"
                            className="rounded bg-primary-700 text-gray-50 px-2 py-1"
                            onClick={() => setShowHoliday(!showHoliday)}
                            aria-label={!showHoliday ? "Skryť sviatky" : "Zobraziť sviatky"}
                        >
                            <LuCalendarHeart />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="text-gray-50 bg-primary-700 px-4 py-0 rounded-r-full ml-[-2px] cursor-pointer font-semibold" onClick={() => setShowHoliday(!showHoliday)}>
                        {!showHoliday ? "Skryť sviatky" : "Zobraziť sviatky"}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
