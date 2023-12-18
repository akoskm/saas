import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession, commitSession } from "~/sessions";
import AuthForm from "~/components/AuthForm";
import getTenantDetails from "~/services/get_tenant_details";
import { signIn } from "~/services/fusionauth_tenant";
import { getAppIdForTenant } from "~/services/get_app_id_for_tenant";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("userId")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/");
  }

  const data = { error: session.get("error") };

  return json(data, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get("Cookie"));
  const formData = await request.formData();
  const { email, password } = Object.fromEntries(formData);

  invariant(email, "Missing email");
  invariant(password, "Missing password");

  const { tenantId } = await getTenantDetails(request);

  invariant(tenantId, "Missing tenantId");

  const applicationId = await getAppIdForTenant(tenantId);

  const loginRequest = {
    loginId: email as string,
    password: password as string,
    applicationId,
  };

  try {
    const { response } = await signIn(request, loginRequest);
    if (!response.user?.id) throw new Error("Login failed");

    if (!response.refreshToken)
      throw new Error(
        "Refresh Token is not sent. Turn on Generate refresh tokens in FusionAuth.",
      );

    session.set("userId", response.user.id);
    session.set("refreshToken", response.refreshToken);
    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (err) {
    const error = err as ClientResponse<string>;
    return json(
      { error: { message: error.response } },
      { status: error.statusCode },
    );
  }
};
export default function Login() {
  return (
    <AuthForm id="signin-form" method="post">
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
          className="form-input"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </AuthForm>
  );
}
