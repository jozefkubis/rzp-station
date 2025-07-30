import Button from "../Button";

// ShiftChoiceModal.jsx
export default function ShiftChoiceModalBottom({
  onPickBottom,
  onDeleteBottom,
  disabled,
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {["X", "xD", "xN", 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((t) => (
        <Button
          key={t}
          variant={
            t === "X" || t === "xD" || t === "xN"
              ? "secondaryShiftX"
              : "secondary"
          }
          size="medium"
          onClick={() => onPickBottom(t)}
          disabled={disabled}
        >
          {t}
        </Button>
      ))}

      <Button variant="danger" onClick={onDeleteBottom} disabled={disabled}>
        Zmazať
      </Button>
    </div>
  );
}
