import type { RegistrationRequest } from "@fusionauth/typescript-client";
import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
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
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </AuthForm>
  );
}
