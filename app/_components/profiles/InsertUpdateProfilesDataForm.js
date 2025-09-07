"use client";

import Button from "@/app/_components/Button";
import FormInput from "@/app/_components/FormInput";
import ImageUploader from "@/app/_components/profiles/ImageUploader";
import handleSubmitUploadProfileData from "@/app/_lib/functions/handleSubmitUploadProfileData";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function InsertUpdateProfilesDataForm({ profiles }) {
  const [error, setError] = useState("");
  const [full_name, setFull_name] = useState("");
  const [username, setUsername] = useState("");
  const [bodyNumber, setBodyNumber] = useState("");
  const [contract, setContract] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [medCheckDate, setMedCheckDate] = useState("");
  const [psychoCheckDate, setPsychoCheckDate] = useState("");
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
      data-cy="admin-update-profiles-data-form"
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
          label="Číslo komory"
          id="bodyNumber"
          type="text"
          placeholder="Číslo komory"
          name="body_number"
          onChange={(e) => setBodyNumber(e.target.value)}
          value={bodyNumber || profiles?.body_number || ""}
          {...(!profiles && { required: true })}
        />
      </div>

      <div className="">
        <FormInput
          label="Úväzok"
          id="contract"
          type="text"
          placeholder="Úväzok"
          name="contract"
          onChange={(e) => setContract(e.target.value)}
          value={contract || profiles?.contract || ""}
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
          label="Dátum lekárskej prehliadky"
          id="medCheckDate"
          type="date"
          placeholder="Dátum lekárskej prehliadky"
          name="medCheckDate"
          onChange={(e) => setMedCheckDate(e.target.value)}
          value={medCheckDate || profiles?.medCheckDate || ""}
          {...(!profiles && { required: true })}
        />
      </div>

      <div className="flex flex-col">
        <FormInput
          label="Dátum psychotesty"
          id="psychoCheckDate"
          type="date"
          placeholder="Dátum psychotesty"
          name="psycho_check"
          onChange={(e) => setPsychoCheckDate(e.target.value)}
          value={psychoCheckDate || profiles?.psycho_check || ""}
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
        <Button data-cy="admin-update-profile-button" variant="primary" size="large">
          Aktualizovať profil
        </Button>
      </div>
    </form>
  );
}

export default InsertUpdateProfilesDataForm;
