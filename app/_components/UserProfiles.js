"use client";

import UserCard from "./UserCard";

export default function UserProfiles({ profiles }) {
  return (
    <main className="w-full px-20 pb-20">
      <h1 className="p-10 text-center text-2xl font-bold text-primary-700">
        Zoznam stanice RZP
      </h1>

      <ul className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {profiles.map((profile) => (
          <UserCard key={profile.id} profile={profile} />
        ))}
      </ul>
    </main>
  );
}

