import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { BuildingOfficeIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useLoaderData } from "@remix-run/react";
import getTenantDetails from "~/services/get_tenant_details";
import getUserFromSession from "~/services/session";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUserFromSession(request);
    const lastLogin = new Date(user.lastLoginInstant ?? "").toLocaleString();
    const { tenantId, tenantName } = await getTenantDetails(request);
    return json({
      loginId: user.email,
      lastLogin,
      tenantId,
      tenantName,
    });
  } catch (e) {
    return json({
      loginId: null,
    });
  }
}

export default function Index() {
  const { loginId } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-3xl font-bold">Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            className="underline"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
        <li>
          <a
            target="_blank"
            className="underline"
            href="https://fusionauth.io/docs/"
            rel="noreferrer"
          >
            FusionAuth Docs
          </a>
        </li>
      </ul>
      {!loginId && (
        <div className="flex flex-row gap-4">
          <Link className="btn btn-primary" to="/signup">
            Personal sign up
            <UserIcon className="block h-6 w-6" aria-hidden="true" />
          </Link>
          <Link className="btn btn-primary" to="/org-signup">
            Sign Up as an Organization
            <BuildingOfficeIcon className="block h-6 w-6" aria-hidden="true" />
          </Link>
        </div>
      )}
    </div>
  );
}
