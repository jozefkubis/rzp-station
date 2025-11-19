import { Printer } from "lucide-react";
import Button from "../Button";

function Print() {
    function printDocument() {
        window.print();
    }

    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={printDocument}>
                <Printer className="md:h-5 md:w-5" />
            </Button>
        </div>
    )
}

export default Print
