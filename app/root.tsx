import { json } from "@remix-run/node";
import type { LoaderFunctionArgs, LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import stylesheet from "~/tailwind.css";
import Navigation from "./components/Navigation";
import getUserFromSession from "./services/session";
import { destroySession, getSession } from "./sessions";
import getTenantDetails from "./services/get_tenant_details";
import getFusionAuthClient from "./services/get_fusion_auth_client";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesheet,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUserFromSession(request);
    return json({ loginId: user.email });
  } catch (e) {
    return json({ loginId: null });
  }
}

export async function action({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const refreshToken = session.get("refreshToken");
  if (refreshToken) {
    const { tenantId } = await getTenantDetails(request);
    getFusionAuthClient(tenantId).logout(true, refreshToken);
  }
  session.unset("userId");
  return json(
    { loginId: null },
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    },
  );
}

export default function App() {
  const { loginId } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation loginId={loginId} />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
