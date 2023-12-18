import { getSession } from "~/sessions";
import getTenantDetails from "./get_tenant_details";
import getFusionAuthClient from "./get_fusion_auth_client";

export default async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) throw new Error("User not found");
  const { tenantId } = await getTenantDetails(request);

  const {
    response: { user },
  } = await getFusionAuthClient(tenantId).retrieveUser(userId);
  if (!user?.email) {
    throw new Error("FusionAuth User not found");
  }
  return user;
}
