import type { RegistrationRequest } from "@fusionauth/typescript-client";
import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import AuthForm from "~/components/AuthForm";
import getFusionAuthClient from "~/services/get_fusion_auth_client";
import getTenantDetails from "~/services/get_tenant_details";

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
    const { tenantId } = await getTenantDetails(request);
    getFusionAuthClient(tenantId).register("", registrationRequest);
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
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="form-input"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="form-input"
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </AuthForm>
  );
}
