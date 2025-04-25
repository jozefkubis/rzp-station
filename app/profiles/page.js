// import Header from "../_components/Header";
import UserProfiles from "../_components/UserProfiles";
import { getAllProfiles } from "../_lib/data-service";

export const metadata = {
  title: "Profily",
};

export default async function page() {

  const profiles = await getAllProfiles();

  return (
    <div>
      {/* <Header /> */}
      <UserProfiles profiles={profiles} />
    </div>
  );
}
