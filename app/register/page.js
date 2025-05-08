import Header from "../_components/Header";
import RegisterForm from "../_components/RegisterForm";

export const metadata = {
  title: "Registrácia",
};

export default async function Page() {
  return (
    <div data-cy="register-page">
      <Header />
      <RegisterForm />
    </div>
  );
}
