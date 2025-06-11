import { useFormStatus } from "react-dom";
import SpinnerMini from "@/app/_components/SpinnerMini";

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="disable:bg-creamy-300 my-4 w-full rounded-md bg-quaternary-900 py-3 text-xl font-semibold text-primary-50 transition hover:bg-quaternary-800 active:scale-95"
    >
      {pending ? <SpinnerMini /> : "Prihlásiť sa"}
    </button>
  );
}
