"use client";

import { useEffect, useState } from "react";
import FormInput from "./FormInput";
import handleSubmitUploadProfileData from "../_lib/functions/handleSubmitUploadProfileData";
import ImageUploader from "./ImageUploader";
import toast from "react-hot-toast";
import Button from "./Button";

function InsertUpdateProfilesDataForm({ profiles }) {
  const [error, setError] = useState("");
  const [full_name, setFull_name] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [medCheckDate, setMedCheckDate] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  function handleSubmit(e) {
    e.preventDefault();
    handleSubmitUploadProfileData(e, { setError, avatar });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex h-screen w-1/2 flex-col justify-center rounded-lg p-8"
    >
      <div className="">
        <FormInput
          label="Meno a priezvisko"
          id="full_name"
          type="text"
          placeholder="Meno a priezvisko"
          name="full_name"
          onChange={(e) => setFull_name(e.target.value)}
          value={full_name || profiles?.full_name || ""}
          {...(!profiles && { required: true })}
        />
      </div>

      <div className="">
        <FormInput
          label="Uživatelské meno"
          id="username"
          type="text"
          placeholder="Uživatelské meno"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          value={username || profiles?.username || ""}
          {...(!profiles && { required: true })}
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
          value={address || profiles?.address || ""}
          {...(!profiles && { required: true })}
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
          value={dateOfBirth || profiles?.dateOfBirth || ""}
          {...(!profiles && { required: true })}
        />
      </div>

      <div className="flex flex-col">
        <FormInput
          label="Dátum prehliadky"
          id="medCheckDate"
          type="date"
          placeholder="Dátum prehliadky"
          name="medCheckDate"
          onChange={(e) => setMedCheckDate(e.target.value)}
          value={medCheckDate || profiles?.medCheckDate || ""}
          {...(!profiles && { required: true })}
        />
      </div>

      <div className="flex flex-col">
        <FormInput
          label="Telefónne číslo"
          id="phone"
          type="tel"
          placeholder="+421 123 456 789"
          pattern="[+][0-9]{1,3}[0-9]{9,14}"
          name="phone"
          onChange={(e) => setPhone(e.target.value)}
          value={phone || profiles?.phone || ""}
          {...(!profiles && { required: true })}
        />
      </div>

      <div className="flex justify-center p-5">
        <ImageUploader onAvatarSelect={setAvatar} />
      </div>

      <div className="flex justify-end p-5">
        <Button variant="primary" size="large">
          Aktualizovať profil
        </Button>
      </div>
    </form>
  );
}

export default InsertUpdateProfilesDataForm;
