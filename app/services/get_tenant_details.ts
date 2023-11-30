import getTenantName from "./get_tenant_name";
import getFusionAuthClient from "./get_fusion_auth_client";

const { DEFAULT_TENANT_ID, DEFAULT_TENANT_NAME } = process.env;

const getTenantDetails = async (req: Request) => {
  // extract hostname from request
  const tenantName = getTenantName(req.headers.get("host") || "");

  if (tenantName === DEFAULT_TENANT_NAME) {
    return { tenantId: DEFAULT_TENANT_ID, tenantName };
  }

  const tenantsResult = await getFusionAuthClient("default").retrieveTenants();

  const tenant = tenantsResult?.response?.tenants?.find(
    (tenant) => tenant.name === tenantName,
  );

  if (tenant?.id) {
    return { tenantId: tenant.id, tenantName };
  }

  return { tenantId: DEFAULT_TENANT_ID, tenantName };
};

export default getTenantDetails;
