import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import { redirect, json } from "@remix-run/node";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import faClient from "~/services/fusion_auth_client";
import invariant from "tiny-invariant";
import { getSession, commitSession } from "~/sessions";
import Input from "~/components/Input";
import AuthForm from "~/components/AuthForm";

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

  const loginRequest = {
    loginId: email as string,
    password: password as string,
    applicationId: process.env.FUSIONAUTH_DEFAULT_APP_ID,
  };
  try {
    const { response } = await faClient.login(loginRequest);
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
    console.log(JSON.stringify(err));
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
      <Input id="email" name="email" type="email" label="Email" required />
      <Input
        id="password"
        name="password"
        type="password"
        label="Password"
        required
      />
      <button type="submit" className="btn-primary">
        Login
      </button>
    </AuthForm>
  );
}
