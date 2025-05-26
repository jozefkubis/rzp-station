import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@radix-ui/react-tooltip";

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
                            className="rounded bg-blue-600 text-white px-2 py-1"
                            onClick={handleAdd}
                            aria-label="Pridať udalosť"
                        >
                            +
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="text-white bg-blue-600 px-4 py-1 rounded-r-full ml-[-2px] cursor-pointer font-semibold" onClick={handleAdd}>
                        Pridať udalosť
                    </TooltipContent>
                </Tooltip>

                <Tooltip>
                    <TooltipTrigger asChild>
                        <button
                            className="rounded bg-[#FFF144] text-gray-900 px-2 py-1"
                            onClick={() => setShowHoliday(!showHoliday)}
                            aria-label={!showHoliday ? "Skryť sviatky" : "Zobraziť sviatky"}
                        >
                            +
                        </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" align="center" className="text-primary-700 bg-[#FFF144] px-4 py-1 rounded-r-full ml-[-2px] cursor-pointer font-semibold" onClick={() => setShowHoliday(!showHoliday)}>
                        {!showHoliday ? "Skryť sviatky" : "Zobraziť sviatky"}
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
