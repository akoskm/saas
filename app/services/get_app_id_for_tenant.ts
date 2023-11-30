import getFusionAuthClient from "./get_fusion_auth_client";

export async function getAppIdForTenant(tenantId: string) {
  const { DEFAULT_TENANT_ID, FUSIONAUTH_DEFAULT_APP_ID } = process.env;

  if (tenantId === DEFAULT_TENANT_ID) {
    return FUSIONAUTH_DEFAULT_APP_ID;
  }

  const applicationsResult =
    await getFusionAuthClient(tenantId).retrieveApplications();

  const applicationId =
    applicationsResult?.response?.applications?.find(
      (application) => application.name?.includes("App"),
    )?.id || applicationsResult?.response?.application?.id;

  if (!applicationId) {
    return FUSIONAUTH_DEFAULT_APP_ID;
  }

  return applicationId;
}
