"use client";

export default function BirthdayCard({ profiles = [] }) {
  // --- dátum M M - D D ---
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  const todayDate = `${month}-${day}`;

  // --- mená oslávencov ---
  const birthdayNames = profiles
    .filter((p) => p?.dateOfBirth?.slice(5) === todayDate)
    .map((p) => p.full_name)
    .filter(Boolean);

  if (birthdayNames.length === 0) return null;

  const verb = birthdayNames.length > 1 ? "majú" : "má";

  return (
    <section
      aria-live="polite"
      className="flex w-full justify-center px-2 pb-2 md:px-6"
    >
      <div className="flex w-full flex-col gap-2 rounded-2xl bg-gradient-to-r from-pink-50 via-rose-100 to-pink-50 px-4 py-3 text-pink-700 shadow-lg ring-1 ring-pink-200/70 sm:px-5 sm:py-4 md:w-auto md:flex-row md:items-center md:gap-4 md:px-6 md:py-5">
        {/* Ikona/emoji – jemne živé, ale bez custom CSS */}
        <div className="flex items-center justify-center">
          <span
            className="animate-bounce text-xl sm:text-2xl md:text-3xl"
            role="img"
            aria-label="party"
          >
            🎉
          </span>
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-sm font-semibold sm:text-base md:text-xl">
            Dnes {verb} narodeniny{" "}
            <span className="font-bold text-pink-800">
              {birthdayNames.length === 1
                ? birthdayNames[0]
                : birthdayNames.join(", ")}
            </span>
            !
          </p>

          {/* „Čipsy“ s menami – na mobile zalamované, na desktope v jednom riadku */}
          {birthdayNames.length > 1 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {birthdayNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center rounded-full bg-white/70 px-2.5 py-1 text-xs text-pink-700 shadow ring-1 ring-pink-200 sm:text-sm"
                >
                  🎂 {name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dekor – len na md+ (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <span className="text-lg" role="img" aria-label="balloon">
            🎈
          </span>
          <span className="text-lg" role="img" aria-label="gift">
            🎁
          </span>
        </div>
      </div>
    </section>
  );
}
