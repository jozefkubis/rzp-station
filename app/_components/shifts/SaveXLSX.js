import { FileSpreadsheet } from "lucide-react";
import Button from "../Button";

function SaveXLSX({ onXlsx }) {
    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={onXlsx}>
                <FileSpreadsheet className="md:h-5 md:w-5 text-emerald-600" />
            </Button>
        </div>
    );
}

export default SaveXLSX;

