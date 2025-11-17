import { LuSave } from "react-icons/lu";
import Button from "../Button";

function Save({ onExport }) {
    return (
        <div>
            <Button variant="printOrSave" size="printOrSave" onClick={onExport}>
                <LuSave className="md:h-6 md:w-6" />
            </Button>
        </div>
    )
}

export default Save
