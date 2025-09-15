import Button from "../Button";

// ShiftChoiceModalBottom.jsx
export default function ShiftChoiceModalBottom({
  onPickBottom,
  onDeleteBottom,
  disabled,
}) {
  const options = [
    { t: "xD", h: null },
    { t: "xN", h: null },
    { t: "X", h: null },
    { t: "ZA3", h: null },
    { t: "ZA4", h: null },
    { t: "BY", h: null },
    { t: "STR", h: null },
    { t: "TER", h: null },
    { t: "MAK", h: null },
    { t: "0.5", h: 1 },
    { t: "1", h: 1 },
    { t: "1.5", h: 1.5 },
    { t: "2", h: 2 },
    { t: "2.5", h: 2.5 },
    { t: "3", h: 3 },
    { t: "3.5", h: 3.5 },
    { t: "4", h: 4 },
    { t: "4.5", h: 4.5 },
    { t: "5", h: 5 },
  ];

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {options.map(({ t, h }) => (
        <Button
          key={t}
          variant={
            t === "X" || t === "xD" || t === "xN"
              ? "secondaryShiftX"
              : "secondary"
          }
          size="medium"
          onClick={() => onPickBottom(t, h)}
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
