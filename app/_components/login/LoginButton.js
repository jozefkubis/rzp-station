import SpinnerMini from "@/app/_components/SpinnerMini";
import { useFormStatus } from "react-dom";

export default function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="my-4 w-full rounded-md border border-logo bg-primary-900 py-3 text-xl font-semibold text-primary-50 transition hover:bg-quaternary-800 active:scale-95 disabled:bg-primary-800 md:border-none md:bg-blue-700 md:disabled:bg-quaternary-900"
    >
      {pending ? <SpinnerMini /> : "Prihlásiť sa"}
    </button>
  );
}
