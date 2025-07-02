import Button from "../Button";

export default function ProfilesChoiceModal({
  profiles,
  setIsProfilesModalOpen,
}) {
  function handleClick() {
    setIsProfilesModalOpen(false);
  }

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      {profiles.map((p) => (
        <Button
          key={p.id}
          variant="secondary"
          size="small"
          onClick={handleClick}
        >
          {p.full_name}
        </Button>
      ))}
    </div>
  );
}
