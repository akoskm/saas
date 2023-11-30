import type { RegistrationRequest } from "@fusionauth/typescript-client";
import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import AuthForm from "~/components/AuthForm";
import Input from "~/components/Input";
import faClient from "~/services/fusion_auth_client";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);
  const registrationRequest: RegistrationRequest = {
    user,
    registration: {
      applicationId: process.env.FUSIONAUTH_DEFAULT_APP_ID,
    },
  };
  try {
    await faClient.register("", registrationRequest);
    return redirect("/signin");
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
