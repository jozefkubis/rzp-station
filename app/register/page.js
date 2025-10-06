import Header from "../_components/Header";
import RegisterForm from "../_components/RegisterForm";
import { getAdmin, getUser } from "../_lib/data-service";

export const metadata = {
  title: "Registrácia",
};

export default async function Page() {
  const user = await getUser();
  const admin = await getAdmin(user.email);

  return (
    <div data-cy="register-page">
      <Header />
      <RegisterForm admin={admin} />
    </div>
  );
}
