import Header from "../_components/Header";
import UserProfiles from "../_components/profiles/UserProfiles";
import { getAllProfiles } from "../_lib/data-service";

export const metadata = {
  title: "Profily",
};

export default async function Page() {
  const profiles = await getAllProfiles();

  if (!profiles || profiles.length === 0) {

    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-500">
        Žiadne profily nenájdené alebo chyba načítania.
      </div>
    );
  }

  return (
    <div data-cy="profiles-page">
      <Header />
      <UserProfiles profiles={profiles} />
    </div>
  );
}
