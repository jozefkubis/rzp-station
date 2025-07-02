import Button from "../Button";

export default function ProfilesChoiceModal() {
  function handleClick() {}

  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-2">
      <Button variant="secondary" size="small" onClick={handleClick}>
        ProfilesChoiceModal
      </Button>
    </div>
  );
}
