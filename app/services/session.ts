import { getSession } from "~/sessions";
import getTenantDetails from "./get_tenant_details";
import getFusionAuthClient from "./get_fusion_auth_client";
import { getAppIdForTenant } from "./get_app_id_for_tenant";

export default async function getUserFromSession(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (!userId) throw new Error("User not found");
  const { tenantId } = await getTenantDetails(request);
  if (!tenantId) throw new Error("Tenant not found");
  const appId = await getAppIdForTenant(tenantId);

  const {
    response: { user },
  } = await getFusionAuthClient(tenantId).retrieveUser(userId);
  if (!user?.email) {
    throw new Error("FusionAuth User not found");
  }
  const role = user.registrations?.find((r) => r.applicationId === appId)?.roles?.[0];
  return {
    ...user,
    role,
    isAdmin: role === "admin",
    defaultTenant: user.tenantId === process.env.DEFAULT_TENANT_ID,
  };
}
