"use client";

import { useEffect, useState } from "react";
import UpdateProfileButton from "./UpdateProfileButton";
import FormInput from "./FormInput";
import toast from "react-hot-toast";
import handleSubmitAdminUpdateProfileData from "../_lib/functions/handleSubmitAdminUpdateProfileData ";
import Image from "next/image";

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
    <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 px-32 py-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-lg p-8 "
      >
        <div className="flex flex-col">
          <FormInput
            id="full_name"
            type="text"
            placeholder="Meno a priezvisko"
            name="full_name"
            onChange={(e) => setFull_name(e.target.value)}
            value={full_name || profile?.full_name || ""}
            {...(!profile && { required: true })}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            id="address"
            type="text"
            placeholder="Adresa"
            name="address"
            onChange={(e) => setAddress(e.target.value)}
            value={address || profile?.address || ""}
            {...(!profile && { required: true })}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            id="dateOfBirth"
            type="date"
            placeholder="Dátum narodenia"
            name="dateOfBirth"
            onChange={(e) => setDateOfBirth(e.target.value)}
            value={dateOfBirth || profile?.dateOfBirth || ""}
            {...(!profile && { required: true })}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            id="medCheckDate"
            type="date"
            placeholder="Dátum prehliadky"
            name="medCheckDate"
            onChange={(e) => setMedCheckDate(e.target.value)}
            value={medCheckDate || profile?.medCheckDate || ""}
            {...(!profile && { required: true })}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            id="phone"
            type="tel"
            placeholder="+421 123 456 789"
            // pattern="[+][0-9]{1,3}[0-9]{9,14}"
            name="phone"
            onChange={(e) => setPhone(e.target.value)}
            value={phone || profile?.phone || ""}
            {...(!profile && { required: true })}
          />
        </div>

        <div className="flex flex-col">
          <FormInput
            id="id"
            type="hidden"
            name="id"
            value={profile?.id || ""}
          />
        </div>

        <UpdateProfileButton />
      </form>
      <div className="relative h-[320px] w-[320px] overflow-hidden rounded-full border-4 border-primary-300 mx-auto">
        <Image
          src={profile.avatar_url || blankAvatar}
          fill
          alt="Avatar"
          className="object-cover hover:scale-110"
        />
      </div>
    </div>
  )
}

export default AdminUpdateProfilesDataForm
