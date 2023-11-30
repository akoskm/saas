const { DEFAULT_TENANT_NAME, BASE_HOST } = process.env;

const getTenantName = (hostname: string) => {
  if (hostname === BASE_HOST) return DEFAULT_TENANT_NAME;

  const tenantName = hostname.replace(`.${BASE_HOST}`, "");

  return tenantName;
};

export default getTenantName;
