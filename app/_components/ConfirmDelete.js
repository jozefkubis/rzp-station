import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Button from "./Button";
import Heading from "./Heading";
import SpinnerMini from "./SpinnerMini";

function ConfirmDelete({ resourceName, onConfirm, disabled, onClose, user }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleMoveToProfile() {
    if (!user) return;
    startTransition(() => {
      router.push(`/profiles/${user.user_id}`);
    });
  }

  return (
    <section className="flex w-full md:w-[30rem] flex-col gap-5">
      <Heading type="h3">Vymazať {resourceName}</Heading>
      <p className="mb-5 text-gray-500 text-sm md:text-base">
        Ste si istý, že chcete vymazať &nbsp;
        <span className="font-semibold text-red-600 text-sm md:text-base">{resourceName}</span>?
      </p>

      <div className="flex justify-end gap-2 md:gap-5">
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

        {user && (
          <Button
            variant="primary"
            size="medium"
            onClick={handleMoveToProfile}
            disabled={isPending}
          >
            {isPending ? (
              <div className="inline-flex items-center gap-2">
                Smerujem
                <span>
                  <SpinnerMini />
                </span>
              </div>
            ) : (
              "Prejsť na profil"
            )}
          </Button>
        )}

        <Button variant="danger" disabled={disabled} onClick={onConfirm}>
          {disabled ? (
            <div className="inline-flex items-center gap-2">
              Mažem
              <span>
                <SpinnerMini />
              </span>
            </div>
          ) : (
            "Vymazať"
          )}
        </Button>
      </div>
    </section>
  );
}

export default ConfirmDelete;
