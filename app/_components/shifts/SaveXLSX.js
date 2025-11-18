import { BsFiletypeXlsx } from "react-icons/bs";
import Button from "../Button";

function SaveXLSX({ onXlsx }) {
    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={onXlsx}>
                <BsFiletypeXlsx className="md:h-5 md:w-5" />
            </Button>
        </div>
    )
}

export default SaveXLSX
