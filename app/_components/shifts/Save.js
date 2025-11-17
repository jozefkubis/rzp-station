import { LuSave } from "react-icons/lu";
import Button from "../Button";

function Save() {
    function saveDocument() {
        console.log("saveDocument");
    }

    return (
        <div>
            <Button variant="printOrSave" size="printOrSave" onClick={saveDocument}>
                <LuSave className="md:h-6 md:w-6" />
            </Button>
        </div>
    )
}

export default Save
