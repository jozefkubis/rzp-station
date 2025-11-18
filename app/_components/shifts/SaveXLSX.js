import { BsFiletypeXlsx } from "react-icons/bs";
import Button from "../Button";

function SaveXLSX({ onXlsx }) {
    return (
        <div>
            <Button variant="printOrSave" size="printOrSave" onClick={onXlsx}>
                <BsFiletypeXlsx className="md:h-6 md:w-6" />
            </Button>
        </div>
    )
}

export default SaveXLSX
