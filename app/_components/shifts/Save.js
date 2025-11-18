import { BsFiletypeCsv } from "react-icons/bs";
import Button from "../Button";

function Save({ onExport }) {
    return (
        <div>
            <Button variant="printOrSave" size="printOrSave" onClick={onExport}>
                <BsFiletypeCsv className="md:h-6 md:w-6" />
            </Button>
        </div>
    )
}

export default Save
