import type ClientResponse from "@fusionauth/typescript-client/build/src/ClientResponse";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useState } from "react";
import invariant from "tiny-invariant";
import AuthForm from "~/components/AuthForm";
import { registerTenant } from "~/services/fusionauth_tenant";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const user = Object.fromEntries(formData);

  invariant(user.organization, "Organization name is required");

  const orgName = user.organization as string;

  try {
    await registerTenant(orgName, {
      email: user.email as string,
      password: user.password as string,
    });
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
      <div>
        <label className="block" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="form-input"
        />
      </div>
      <div>
        <label className="block" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="form-input"
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
      </div>
      <div>
        <label className="block" htmlFor="organization">
          Organization Name
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          value={orgName}
          className="form-input"
          required
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            // create a slug from value replacing spaces and removing non alphanumeric characters
            const slug = value
              .replace(/\s+/g, "-")
              .replace(/[^a-zA-Z0-9-]/g, "");
            setOrgName(slug);
          }}
        />
        <p className="block text-slate-700 text-sm mt-2">
          {orgName && `${orgName}.sass.io will be your custom domain.`}
        </p>
      </div>
      <button type="submit" className="btn btn-primary">
        Register
      </button>
    </AuthForm>
  );
}
