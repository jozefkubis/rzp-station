import Button from "../Button";

export default function ShiftChoiceModal({ onPickTop, onDeleteTop, disabled }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {["D", "N", "DN", "ND", "vD", "vN", "zD", "zN", "RD", "PN"].map((t) => (
        <Button
          key={t}
          variant={t === "RD" ? "secondaryShiftRD" : "secondary"}
          size="medium"
          onClick={() => onPickTop(t)}
          disabled={disabled}
        >
          {t}
        </Button>
      ))}

      <Button variant="danger" onClick={onDeleteTop} disabled={disabled}>
        Zmazať
      </Button>
    </div>
  );
}
