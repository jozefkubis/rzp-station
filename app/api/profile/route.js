import {
  getProfile,
  getShiftsForProfileForMonth,
  getUser,
} from "@/app/_lib/data-service";

export async function GET(req) {
  const url = new URL(req.url);
  const offset = Number(url.searchParams.get("m") ?? 0);

  // cieľový 1. deň mesiaca
  const target = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + offset,
    1,
  );

  const user = await getUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const [profile, shifts] = await Promise.all([
    getProfile(user.id),
    getShiftsForProfileForMonth(user.id, target),
  ]);

  return Response.json({ profile, shifts });
}
