"use client";

import { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import ProfilesChoiceModal from "./ProfilesChoiceModal";

export default function InsertShiftButton() {
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);

  function handleProfilesModalOpen() {
    setIsProfilesModalOpen(true);
  }
  return (
    <>
      <div className="mt-6 self-start 2xl:px-32">
        <Button
          variant="primary"
          size="medium"
          onClick={handleProfilesModalOpen}
        >
          Pridať záchranára
        </Button>
      </div>

      {isProfilesModalOpen && (
        <Modal onClose={() => setIsProfilesModalOpen(false)}>
          <ProfilesChoiceModal />
        </Modal>
      )}
    </>
  );
}
