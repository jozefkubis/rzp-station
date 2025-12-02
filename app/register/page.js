import Header from "../_components/Header";
import RegisterForm from "../_components/RegisterForm";
import { getAdmin, getUser } from "../_lib/profiles-data";

export const metadata = {
  title: "Registrácia",
};

export default async function Page() {
  const user = await getUser();
  const admin = await getAdmin(user.email);

  return (
    <div >
      <Header />
      <div className="md:flex md:items-center md:h-screen overflow-auto w-full">
        <RegisterForm admin={admin} />
      </div>
    </div>
  );
}
