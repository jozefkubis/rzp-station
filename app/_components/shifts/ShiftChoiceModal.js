import Button from "../Button";

export default function ShiftChoiceModal() {
  return (
    <div className="flex gap-2">
      <Button variant="secondary" size="medium">
        D
      </Button>

      <Button variant="secondary" size="medium">
        N
      </Button>

      <Button variant="secondaryShiftX" size="medium">
        X
      </Button>

      <Button variant="secondaryShiftX" size="medium">
        xD
      </Button>

      <Button variant="secondaryShiftX" size="medium">
        xN
      </Button>

      <Button variant="secondary" size="medium">
        vD
      </Button>

      <Button variant="secondary" size="medium">
        vN
      </Button>

      <Button variant="secondary" size="medium">
        zD
      </Button>

      <Button variant="secondary" size="medium">
        zN
      </Button>

      <Button variant="secondaryShiftRD" size="medium">
        RD
      </Button>
    </div>
  );
}
