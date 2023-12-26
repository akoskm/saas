import getUserFromSession from "~/services/session";

export async function verifyUser(request: Request) {
  try {
    await getUserFromSession(request);
    return true;
  } catch (e) {
    return false;
  }
}
