import Header from "../_components/Header";
import UserProfiles from "../_components/profiles/UserProfiles";
import { getAdmin, getAllProfiles, getUser } from "../_lib/profiles-data";

export const metadata = {
  title: "Profily",
};

export default async function Page() {
  // const profiles = await getAllProfiles();
  // const user = await getUser();

  const [profiles, user] = await Promise.all([getAllProfiles(), getUser()]);
  const admin = await getAdmin(user.email);

  if (!profiles || profiles.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-xl text-gray-500">
        Žiadne profily nenájdené alebo chyba načítania.
      </div>
    );
  }

  return (
    <div >
      <Header />
      <UserProfiles profiles={profiles} admin={admin} />
    </div>
  );
}
