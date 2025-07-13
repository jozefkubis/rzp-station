import {
  getProfile,
  getShiftsForProfile,
  getUser,
} from "@/app/_lib/data-service";
import {
  formatDate,
  getDaysUntilNextMedCheck,
} from "@/app/_lib/helpers/functions";
import { format } from "date-fns";

export default async function MyProfile() {
  const user = await getUser();
  const shiftsForProfile = await getShiftsForProfile(user.id);
  const profile = await getProfile(user.id);

  // MARK: DAY SHIFTS
  const dayShifts = shiftsForProfile.filter(
    (shift) => shift.shift_type === "D",
  ).length;

  const dayHours = dayShifts * 12;

  // MARK: NIGHT SHIFTS
  const nightShifts = shiftsForProfile.filter(
    (shift) => shift.shift_type === "N",
  ).length;

  const nightHours = nightShifts * 12;

  // MARK: VACATIONS
  const rd = shiftsForProfile.filter(
    (shift) => shift.shift_type === "RD",
  ).length;

  const rdHours = rd * 7.5;

  // MARK: ALL SHIFTS
  const allShifts = dayShifts + nightShifts;
  const allHours = allShifts * 12 + rdHours;

  // MARK: DAY OFF
  const xShifts = shiftsForProfile.filter((shift) =>
    shift.shift_type?.toLowerCase().includes("x"),
  ).length;

  //MARK: DAYS LEFT TO MEDCHECK
  const medCheckDaysLeft = getDaysUntilNextMedCheck(profile.medCheckDate);
  const psychoCheckDaysLeft = getDaysUntilNextMedCheck(profile.psycho_check);

  return (
    <section className="w-full space-y-2 rounded-2xl bg-white p-4 shadow">
      <h3 className="text-lg font-semibold">{profile.full_name}</h3>
      <p className="text-sm text-gray-600">
        Služby tento mesiac: {allShifts} - ({allHours} hod.)
      </p>
      <p className="text-sm text-gray-600">
        Denné: {dayShifts} - ({dayHours} hod.)
      </p>
      <p className="text-sm text-gray-600">
        Nočné: {nightShifts} - ({nightHours} hod.)
      </p>
      <p className="text-sm text-gray-600">
        Dovolenka: {rd} - ({rdHours} hod.)
      </p>
      <p className="text-sm text-gray-600">Požiadavky: {xShifts}</p>

      <p className="text-sm text-gray-600">
        Lekárska prehliadka: {formatDate(profile.medCheckDate)} (
        <span
          className={
            medCheckDaysLeft < 0
              ? "text-red-700"
              : medCheckDaysLeft < 30
                ? "text-orange-500"
                : "text-green-700"
          }
        >
          {medCheckDaysLeft < 0
            ? `Prehliadka vypršala pred ${Math.abs(medCheckDaysLeft)} dňami`
            : `Do prehliadky ostáva ${medCheckDaysLeft} dní`}
        </span>
        )
      </p>
      {profile.psycho_check !== null && (
        <p className="text-sm text-gray-600">
          Psychotesty: {formatDate(profile.psycho_check)} (
          <span
            className={
              psychoCheckDaysLeft < 0
                ? "text-red-700"
                : psychoCheckDaysLeft < 30
                  ? "text-orange-500"
                  : "text-green-700"
            }
          >
            {psychoCheckDaysLeft < 0
              ? `Prehliadka vypršala pred ${Math.abs(psychoCheckDaysLeft)} dňami`
              : `Do prehliadky ostáva ${psychoCheckDaysLeft} dní`}
          </span>
          )
        </p>
      )}
    </section>
  );
}
