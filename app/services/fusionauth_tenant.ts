import {
  FusionAuthClient,
  type LoginRequest,
  type RegistrationRequest,
} from "@fusionauth/typescript-client";
import getFusionAuthClient from "./get_fusion_auth_client";
import getTenantDetails from "./get_tenant_details";

export async function logout(request: Request, refreshToken: string) {
  const { tenantId } = await getTenantDetails(request);
  getFusionAuthClient(tenantId).logout(true, refreshToken);
}

export async function signIn(request: Request, loginRequest: LoginRequest) {
  const { tenantId } = await getTenantDetails(request);
  return await getFusionAuthClient(tenantId).login(loginRequest);
}

export async function register(
  request: Request,
  registrationRequest: RegistrationRequest,
) {
  const { tenantId } = await getTenantDetails(request);
  return getFusionAuthClient(tenantId).register("", registrationRequest);
}

async function createTenant(organizationId: string) {
  const faClient = getFusionAuthClient("default");
  const tenantResponse = await faClient.retrieveTenant(
    process.env.DEFAULT_TENANT_ID!,
  );
  const tenant = tenantResponse.response.tenant;

  if (!tenant?.id) {
    throw new Error("Couldn't find the blueprint tenant for tenant creation!");
  }

  const tenantConfig = {
    sourceTenantId: faClient.tenantId,
    tenant: {
      name: organizationId,
      issuer: "saasbp.io",
      jwtConfiguration: tenant.jwtConfiguration,
    },
  };
  const createTenantResult = await faClient.createTenant("", tenantConfig);

  if (!createTenantResult?.response?.tenant?.id) {
    throw new Error("Couldn't create tenant. FusionAuth response was empty!");
  }

  return createTenantResult.response.tenant.id;
}

const createApiKey = async (organizationName: string, tenantId: string) => {
  const apiKeyRequest = {
    apiKey: {
      metaData: {
        attributes: {
          description: `API key for ${organizationName}`,
        },
      },
      tenantId,
    },
  };

  const createAPIKeyResult = await getFusionAuthClient("default").createAPIKey(
    "",
    apiKeyRequest,
  );

  if (!createAPIKeyResult?.response?.apiKey?.key) {
    throw new Error(
      "FusionAuth API key create call was successful, but no API key was returned!",
    );
  }

  const fusionAuthTenantLockedApiKey = createAPIKeyResult.response.apiKey.key;

  return fusionAuthTenantLockedApiKey;
};

const configuredRoles = [
  {
    name: "admin",
    description: "Admin role inside the organization",
    isDefault: false,
  },
  {
    name: "member",
    description: "Member role",
    isDefault: true,
  },
];

async function createApplication(organizationId: string, lockedApiKey: string) {
  const FUSIONAUTH_BASE_URL = process.env.FUSIONAUTH_BASE_URL!;

  const newFusionAuthClient = new FusionAuthClient(
    lockedApiKey,
    FUSIONAUTH_BASE_URL,
  );

  const newFusionAuthAppConfig = {
    name: `${organizationId} App`,
    roles: configuredRoles,
    loginConfiguration: {
      generateRefreshTokens: true,
    },
  };

  const createAppResult = await newFusionAuthClient.createApplication("", {
    application: newFusionAuthAppConfig,
    role: configuredRoles[0],
  });

  if (!createAppResult?.response?.application?.id) {
    throw new Error(
      "An error occurred while creating the FusionAuth application.",
    );
  }

  return createAppResult.response.application.id;
}

export async function registerTenant(
  orgName: string,
  defaultUser: { email: string; password: string },
) {
  const tenantId = await createTenant(orgName);
  if (!tenantId) {
    throw new Error("Couldn't create tenant!");
  }
  const lockedApiKey = await createApiKey(orgName, tenantId);
  if (!lockedApiKey) {
    throw new Error("Couldn't create API key!");
  }
  const applicationId = await createApplication(orgName, lockedApiKey);
  if (!applicationId) {
    throw new Error("Couldn't create application!");
  }
  const registrationRequest = {
    user: defaultUser,
    registration: {
      applicationId,
      roles: configuredRoles.map((role) => role.name),
    },
  };
  const faClient = getFusionAuthClient(tenantId);
  return faClient.register("", registrationRequest);
}
