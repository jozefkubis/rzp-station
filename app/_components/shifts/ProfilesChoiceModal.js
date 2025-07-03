import { insertProfileInToRoster } from "@/app/_lib/actions";
import Button from "../Button";

export default function ProfilesChoiceModal({
  profiles,
  setIsProfilesModalOpen,
}) {
  function handleClick(id) {
    setIsProfilesModalOpen(false);
    insertProfileInToRoster(id);
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {profiles.length ? (
        profiles.map(({ id, full_name }) => (
          <Button
            key={id}
            variant="secondary"
            size="small"
            onClick={() => handleClick(id)}
          >
            {full_name || "Neznámy záchranár"}
          </Button>
        ))
      ) : (
        <p className="text-md text-primary-700">
          Všetci záchranári sú už zahrnutí v službách!
        </p>
      )}
    </div>
  );
}
