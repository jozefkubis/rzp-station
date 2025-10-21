"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "../Modal";
import WarningNotice from "../WarningNotice";

export default function UserCard({ profile, admin }) {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (admin !== "ÁNO") setOpenModal(true);
    else if (profile?.id) router.push(`/profiles/${profile.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  const SUPABASE_HOST = "https://kjfjavkvgocatxssthrv.supabase.co";
  const AVATAR_BASE = `${SUPABASE_HOST}/storage/v1/object/public/avatars/`;
  const blankAvatar = `${AVATAR_BASE}1744906899450-avatar.png`;

  const resolveAvatar = (url) => {
    if (!url) return blankAvatar;
    if (!/^https?:\/\//i.test(url))
      return `${AVATAR_BASE}${url.replace(/^\/+/, "")}`;
    return url;
  };

  return (
    <>
      <li
        data-cy="user-card"
        role="button"
        tabIndex={0}
        aria-label={`Profil: ${profile?.full_name || "záchranár"}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={[
          // layout
          "group relative flex h-full w-full cursor-pointer items-center justify-between gap-3 md:flex-col md:gap-6",
          "rounded-2xl border border-primary-100/60 bg-white/70 px-5 py-4 md:px-8 md:py-10",
          // vizuál (glassy + tieň)
          "backdrop-blur supports-[backdrop-filter]:backdrop-blur",
          "shadow-lg hover:shadow-xl",
          // interakcie
          "transition-all duration-200 ease-out hover:bg-primary-50/60 active:scale-[0.98]",
          // focus pre klávesnicu (a11y)
          "outline-none focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
        ].join(" ")}
      >
        {/* Avatar */}
        <div
          className={[
            "relative shrink-0 rounded-full md:rounded-[28px]",
            "h-[80px] w-[80px] md:h-[160px] md:w-[160px]",
            // moderný “ring” + jemná žiara
            "shadow-[0_6px_20px_-8px_rgb(2,132,199,0.35)] ring-4 ring-primary-100/80",
            "overflow-hidden bg-gradient-to-br from-primary-50 to-primary-100",
          ].join(" ")}
        >
          <Image
            src={resolveAvatar(profile?.avatar_url)}
            alt={profile?.full_name ? `Avatar ${profile.full_name}` : "Avatar"}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            data-cy="user-card-avatar"
            sizes="(max-width: 768px) 80px, 160px"
          />
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col items-end gap-1 text-right md:items-center md:text-center">
          <h1
            data-cy="user-card-name"
            className="truncate text-base font-semibold tracking-tight text-primary-800 md:text-2xl"
            title={profile?.full_name || ""}
          >
            {profile?.full_name}
          </h1>

          <p
            data-cy="user-card-email"
            className="max-w-[22ch] truncate text-xs text-gray-500 md:max-w-[28ch] md:text-sm"
            title={profile?.email || ""}
          >
            {profile?.email}
          </p>

          <p
            data-cy="user-card-phone"
            className="text-xs text-gray-500 md:text-sm"
            title={profile?.phone || ""}
          >
            {profile?.phone ? `Tel.: ${profile.phone}` : "—"}
          </p>
        </div>

        {/* jemný “ink” efekt pri hoveri (nezasahuje do obsahu) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-[1] rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(2,132,199,0.08), transparent 40%)",
          }}
        />
      </li>

      {openModal && (
        <Modal onClose={() => setOpenModal(false)}>
          <WarningNotice />
        </Modal>
      )}
    </>
  );
}
