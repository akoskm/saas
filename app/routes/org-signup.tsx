import { FusionAuthClient } from "@fusionauth/typescript-client";
import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import invariant from "tiny-invariant";
import AuthForm from "~/components/AuthForm";
import Input from "~/components/Input";
import getFusionAuthClient from "~/services/get_fusion_auth_client";

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

async function createTenant(organizationId: string) {
  const tenantConfig = {
    sourceTenantId: getFusionAuthClient("default").tenantId,
    tenant: {
      name: organizationId,
      issuer: "saasbp.io",
    },
  };
  const createTenantResult = await getFusionAuthClient("default").createTenant(
    "",
    tenantConfig,
  );

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

async function createApplication(organizationId: string, lockedApiKey: string) {
  const FUSIONAUTH_BASE_URL = process.env.FUSIONAUTH_BASE_URL!;

  const newFusionAuthClient = new FusionAuthClient(
    lockedApiKey,
    FUSIONAUTH_BASE_URL,
  );

  const newVareseFusionAuthAppConfig = {
    name: `${organizationId} App`,
    roles: configuredRoles,
  };

  const createAppResult = await newFusionAuthClient.createApplication("", {
    application: newVareseFusionAuthAppConfig,
    role: configuredRoles[1],
  });

  if (!createAppResult?.response?.application?.id) {
    throw new Error(
      "FusionAuth Varese application create call was successful, but no application was returned!",
    );
  }

  return createAppResult.response.application.id;
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);

  invariant(user.organization, "Organization name is required");

  const orgName = user.organization as string;

  const tenantId = await createTenant(orgName);
  const lockedApiKey = await createApiKey(orgName, tenantId);
  const applicationId = await createApplication(orgName, lockedApiKey);
  try {
    const registrationRequest = {
      user,
      registration: {
        applicationId,
      },
    };
    await getFusionAuthClient("default").register("", registrationRequest);
    return redirect(`${orgName}.saasbp.io/signin`);
  } catch (err) {
    const error = err as ClientResponse<string>;
    return json(
      { error: { message: error.response } },
      { status: error.statusCode },
    );
  }
};

export default function SignUp() {
  const [orgName, setOrgName] = useState("");
  return (
    <AuthForm id="signup-form" method="post">
      <Input id="email" name="email" type="email" label="Email" required />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        required
        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
          e.target.reportValidity();
        }}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          // if password length is < 8 characters set and error
          const value = e.target.value;
          if (value.length < 8) {
            e.target.setCustomValidity(
              "Password must be at least 8 characters",
            );
          } else {
            e.target.setCustomValidity("");
          }
        }}
      />
      <Input
        id="organization"
        name="organization"
        type="text"
        label="Organization Name"
        value={orgName}
        required
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          // create a slug from value replacing spaces and removing non alphanumeric characters
          const slug = value.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "");
          setOrgName(slug);
        }}
        helpText={orgName && `${orgName}.sass.io will be your custom domain.`}
      />
      <button type="submit" className="btn-primary">
        Register
      </button>
    </AuthForm>
  );
}
