import { LuPrinter } from "react-icons/lu";
import Button from "../Button";

function Print() {
    function printDocument() {
        window.print();
    }

    return (
        <div>
            <Button variant="printOrSave" size="printOrSave" onClick={printDocument}>
                <LuPrinter className="md:h-6 md:w-6" />
            </Button>
        </div>
    )
}

export default Print
