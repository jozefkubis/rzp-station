import Header from "../_components/Header";
import getAllShifts, { getAllProfiles } from "../_lib/data-service";

export const metadata = {
  title: "Štatistiky",
};

export default async function page() {

  const shifts = await getAllShifts();
  const shiftsAfterSet = new Set(shifts.map((shift) => shift.profiles.full_name));
  // console.log(shiftsAfterSet);

  const profiles = await getAllProfiles()



  return (
    <div>
      <Header />
      <div className="h-screen">
        <div className="h-full p-[8rem] flex flex-col gap-2">
          {profiles.map((profile) => (
            <div key={profile.id} className="text-2xl text-primary-700" >
              <h1>{profile.full_name}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
