import Button from "../Button";

function SaveCSV({ onYourCalendar }) {
  return (
    <div className="flex">
      <Button variant="printOrSave" size="printOrSave" onClick={onYourCalendar}>
        <span
          className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/10 text-[0.7rem] font-bold tracking-tight text-amber-700 ring-1 ring-amber-500/30 transition-all duration-200 hover:scale-105 hover:bg-amber-500/20 hover:ring-amber-500/60 active:scale-95"
          title="Uložiť moje služby do kalendára (iCal)"
        >
          iC
        </span>
      </Button>
    </div>
  );
}

export default SaveCSV;
