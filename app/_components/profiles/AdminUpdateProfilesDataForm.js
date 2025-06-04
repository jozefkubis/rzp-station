"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "@/app/_components/Button";
import FormInput from "@/app/_components/FormInput";
import handleSubmitAdminUpdateProfileData from "@/app/_lib/functions/handleSubmitAdminUpdateProfileData";

function AdminUpdateProfilesDataForm({ profile }) {
  const [error, setError] = useState("");
  const [full_name, setFull_name] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [medCheckDate, setMedCheckDate] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleSubmit(e) {
    e.preventDefault();
    handleSubmitAdminUpdateProfileData(e, { setError });
  }

  return (
    <form
      data-cy="admin-update-profiles-data-form"
      onSubmit={handleSubmit}
      className="rounded-lg flex flex-col justify-center h-screen w-1/2 mx-auto"
    >
      <div className="">
        <FormInput
          label="Meno a priezvisko"
          id="full_name"
          type="text"
          placeholder="Meno a priezvisko"
          name="full_name"
          onChange={(e) => setFull_name(e.target.value)}
          value={full_name || profile?.full_name || ""}
          {...(!profile && { required: true })}
        />
      </div>

      <div className="">
        <FormInput
          label="Adresa"
          id="address"
          type="text"
          placeholder="Adresa"
          name="address"
          onChange={(e) => setAddress(e.target.value)}
          value={address || profile?.address || ""}
          {...(!profile && { required: true })}
        />
      </div>

      <div className="">
        <FormInput
          label="Dátum narodenia"
          id="dateOfBirth"
          type="date"
          placeholder="Dátum narodenia"
          name="dateOfBirth"
          onChange={(e) => setDateOfBirth(e.target.value)}
          value={dateOfBirth || profile?.dateOfBirth || ""}
          {...(!profile && { required: true })}
        />
      </div>

      <div className="">
        <FormInput
          label="Dátum prehliadky"
          id="medCheckDate"
          type="date"
          placeholder="Dátum prehliadky"
          name="medCheckDate"
          onChange={(e) => setMedCheckDate(e.target.value)}
          value={medCheckDate || profile?.medCheckDate || ""}
          {...(!profile && { required: true })}
        />
      </div>

      <div className="">
        <FormInput
          label="Telefón"
          id="phone"
          type="tel"
          placeholder="+421 123 456 789"
          pattern="[+][0-9]{1,3}[0-9]{9,14}"
          name="phone"
          onChange={(e) => setPhone(e.target.value)}
          value={phone || profile?.phone || ""}
          {...(!profile && { required: true })}
        />
      </div>

      <FormInput
        id="id"
        type="hidden"
        name="id"
        value={profile?.id || ""}
      />

      <div className="flex flex-col justify-center items-end gap-8">

        <Button data-cy="admin-update-profile-button" size="medium">Aktualizovať profil</Button>

        <div>
          <Link
            data-cy="admin-back-to-profile-button"
            href={`/profiles/${profile.id}`}
            className="font-semibold text-primary-700 hover:underline"
          >
            ← Späť na profil
          </Link>
        </div>
      </div>
    </form>
  )
}

export default AdminUpdateProfilesDataForm
