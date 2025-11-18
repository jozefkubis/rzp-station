import { BsFiletypeCsv } from "react-icons/bs";
import Button from "../Button";

function SaveCSV({ onExport }) {
    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={onExport}>
                <BsFiletypeCsv className="md:h-5 md:w-5" />
            </Button>
        </div>
    )
}

export default SaveCSV
