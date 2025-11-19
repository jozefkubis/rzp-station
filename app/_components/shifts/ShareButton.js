import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../Button";

function ShareButton() {
    // const [isCopying, setIsCopying] = useState(false);

    async function handleShare({ shareUrl }) {
        // ak príde shareUrl ako prop → použijeme ju
        // inak vezmeme aktuálnu adresu stránky
        const url = shareUrl ?? window.location.href;

        try {
            // setIsCopying(true);

            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(url);
            } else {
                // fallback pre staršie prehliadače
                const textarea = document.createElement("textarea");
                textarea.value = url;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand("copy");
                document.body.removeChild(textarea);
            }

            toast.success("Link skopírovaný do schránky 👍");
        } catch (err) {
            console.error(err);
            toast.error("Nepodarilo sa skopírovať link");
        } finally {
            // setIsCopying(false);
        }
    }


    return (
        <div className="hidden md:flex">
            <Button variant="printOrSave" size="printOrSave" onClick={handleShare}>
                <Share2 className="md:h-5 md:w-5" />
            </Button>
        </div>
    )
}

export default ShareButton
