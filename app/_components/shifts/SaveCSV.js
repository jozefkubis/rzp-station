import { FileSpreadsheet } from "lucide-react";
import Button from "../Button";

function SaveCSV({ onExport }) {
    return (
        <div className="flex">
            <Button variant="printOrSave" size="printOrSave" onClick={onExport}>
                <FileSpreadsheet className="h-5 w-5 text-amber-600" />
            </Button>
        </div>
    )
}

export default SaveCSV
