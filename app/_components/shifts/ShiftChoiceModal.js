import Button from "../Button";

// ShiftChoiceModal.jsx
export default function ShiftChoiceModal() {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {["D", "N", "X", "xD", "xN", "vD", "vN", "zD", "zN", "RD"].map((t) => (
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
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
