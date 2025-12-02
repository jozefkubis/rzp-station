"use client";

import UserCard from "@/app/_components/profiles/UserCard";

export default function UserProfiles({ profiles, admin }) {
  return (
    <main >
      <h1
        className="pb-3 text-center text-lg font-bold text-primary-700 md:p-10 md:text-2xl"
      >
        Zoznam stanice RZP
      </h1>

      <ul
        className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        {profiles.map((profile) => (
          <UserCard key={profile.id} profile={profile} admin={admin} />
        ))}
      </ul>
    </main>
  );
}
