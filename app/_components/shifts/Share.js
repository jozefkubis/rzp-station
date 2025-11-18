import { FiShare2 } from "react-icons/fi";
import Button from "../Button";

function Share() {
    function printDocument() {
        console.log("share")
    }

    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={printDocument}>
                <FiShare2 className="md:h-5 md:w-5" />
            </Button>
        </div>
    )
}

export default Share
