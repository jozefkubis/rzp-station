"use client";

import { useState } from "react";
import Button from "../Button";
import Modal from "../Modal";
import ProfilesChoiceModal from "./ProfilesChoiceModal";

export default function InsertShiftButton({ profiles, onInsertEmptyShift }) {
  const [isProfilesModalOpen, setIsProfilesModalOpen] = useState(false);

  function handleProfilesModalOpen() {
    setIsProfilesModalOpen(true);
  }
  return (
    <>
      <div>
        <Button
          variant="primary"
          size="medium"
          onClick={handleProfilesModalOpen}
          disabled={profiles.length === 0}
        >
          Pridať záchranára
        </Button>
      </div>

      {isProfilesModalOpen && (
        <Modal onClose={() => setIsProfilesModalOpen(false)}>
          <ProfilesChoiceModal
            profiles={profiles}
            setIsProfilesModalOpen={setIsProfilesModalOpen}
            onInsertEmptyShift={onInsertEmptyShift}
          />
        </Modal>
      )}
    </>
  );
}
