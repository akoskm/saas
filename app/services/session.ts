import { getSession } from "~/sessions";
import faClient from "~/services/fusion_auth_client";

export default async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) throw new Error("User not found");
  const {
    response: { user },
  } = await faClient.retrieveUser(userId);
  if (!user?.email) {
    throw new Error("FusionAuth User not found");
  }
  return user;
}
