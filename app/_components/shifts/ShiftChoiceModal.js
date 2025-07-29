import Button from "../Button";

// ShiftChoiceModal.jsx
export default function ShiftChoiceModal({ onPick, onDelete, disabled }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {[
        "D",
        "N",
        "DN",
        "ND",
        "vD",
        "vN",
        "zD",
        "zN",
        "X",
        "xD",
        "xN",
        "RD",
        "PN",
      ].map((t) => (
        <Button
          key={t}
          variant={
            t === "X" || t.startsWith("x")
              ? "secondaryShiftX"
              : t === "RD"
                ? "secondaryShiftRD"
                : "secondary"
          }
          size="medium"
          onClick={() => onPick(t)}
          disabled={disabled}
        >
          {t}
        </Button>
      ))}

      <Button variant="danger" onClick={onDelete} disabled={disabled}>
        🗑️ zmazať
      </Button>
    </div>
  );
}
