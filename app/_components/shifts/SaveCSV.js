import { FileSpreadsheet } from "lucide-react";
import Button from "../Button";

function SaveCSV({ onExport }) {
    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={onExport}>
                <FileSpreadsheet className="md:h-5 md:w-5 text-amber-600" />
            </Button>
        </div>
    )
}

export default SaveCSV
