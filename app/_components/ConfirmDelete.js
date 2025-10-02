import { useRouter } from "next/navigation";
import Button from "./Button";
import Heading from "./Heading";

function ConfirmDelete({ resourceName, onConfirm, disabled, onClose, user }) {

  const router = useRouter();

  function handleMoveToProfile() {
    router.push(`/profiles/${user.user_id}`);
  }

  return (
    <section className="flex w-[30rem] flex-col gap-5">
      <Heading type="h3">Vymazať {resourceName}</Heading>
      <p className="mb-5 text-gray-500 ">
        Ste si istý, že chcete vymazať &nbsp;
        <span className="font-semibold text-red-600">{resourceName}</span>?
      </p>

      <div className="flex justify-end gap-5">
        <Button
          size="medium"
          variant="secondary"
          disabled={disabled}
          onClick={() => {
            if (disabled) return;
            onClose?.();
          }}
        >
          Zrušiť
        </Button>

        <Button variant="primary" size="medium" onClick={handleMoveToProfile}>
          Prejsť na profil
        </Button>

        <Button variant="danger" disabled={disabled} onClick={onConfirm}>
          {disabled ? "Mažem..." : "Vymazať"}
        </Button>

      </div>
    </section>
  );
}

export default ConfirmDelete;
