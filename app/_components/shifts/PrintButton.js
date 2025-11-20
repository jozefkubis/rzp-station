import { Printer } from "lucide-react";
import Button from "../Button";

function PrintButton() {
  function printDocument() {
    window.print();
  }

  return (
    <div className="flex">
      <Button variant="printOrSave" size="printOrSave" onClick={printDocument}>
        <Printer className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default PrintButton;
