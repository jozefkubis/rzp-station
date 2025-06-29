import Button from "../Button";

// ShiftChoiceModal.jsx
export default function ShiftChoiceModal({ onPick }) {
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
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
