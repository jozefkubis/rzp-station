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
    setSelectedEvent(null); // vynuluj vybratú udalosť
    setDraftSlot(null); // vynuluj "draft" slot
    setIsOpenModal(true); // otvor modal v režime PRIDAŤ
  }

  // MARK: RENDER.............................................................................
  return (
    <div className="hidden md:flex flex-col gap-2 md:z-10">
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded bg-primary-700 px-2 py-1 text-gray-50"
              onClick={handleAdd}
              aria-label="Pridať udalosť"
            >
              <FaRegCalendarPlus />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            className="ml-[-2px] cursor-pointer rounded-r-full bg-primary-700 px-4 py-0 font-semibold text-gray-50"
            onClick={handleAdd}
          >
            Pridať udalosť
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="rounded bg-primary-700 px-2 py-1 text-gray-50"
              onClick={() => setShowHoliday(!showHoliday)}
              aria-label={!showHoliday ? "Skryť sviatky" : "Zobraziť sviatky"}
            >
              <LuCalendarHeart />
            </button>
          </TooltipTrigger>
          <TooltipContent
            side="right"
            align="center"
            className="ml-[-2px] cursor-pointer rounded-r-full bg-primary-700 px-4 py-0 font-semibold text-gray-50"
            onClick={() => setShowHoliday(!showHoliday)}
          >
            {!showHoliday ? "Skryť sviatky" : "Zobraziť sviatky"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
