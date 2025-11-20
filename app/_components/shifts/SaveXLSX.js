import { FileSpreadsheet } from "lucide-react";
import Button from "../Button";

function SaveXLSX({ onXlsx }) {
    return (
        <div className="flex">
            <Button variant="printOrSave" size="printOrSave" onClick={onXlsx}>
                <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </Button>
        </div>
    );
}

export default SaveXLSX;

