import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import getTenantDetails from "~/services/get_tenant_details";
import getUserFromSession from "~/services/session";

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
    return redirect("/signin");
  }
}

export default function Me() {
  const { loginId, lastLogin, tenantId, tenantName } =
    useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-3xl font-bold">Welcome {loginId}</h1>
      <p>
        Last login: <strong>{lastLogin}</strong>
      </p>
      <p>
        Tenant ID: <strong>{tenantId}</strong>
      </p>
      <p>
        Tenant Name: <strong>{tenantName}</strong>
      </p>
      <a
        target="_blank"
        className="underline"
        href="https://remix.run/docs"
        rel="noreferrer"
      >
        Remix Docs
      </a>
    </div>
  );
}
