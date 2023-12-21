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
import { logout } from "~/services/fusionauth_tenant";
import Chat from "~/components/Chat";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: stylesheet,
  },
];

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUserFromSession(request);
    return json({ loginId: user.email, defaultTenant: user.defaultTenant });
  } catch (e) {
    return json({ loginId: null, defaultTenant: true });
  }
}

async function signOut(request) {
  const session = await getSession(request.headers.get("Cookie"));
  const refreshToken = session.get("refreshToken");
  if (refreshToken) {
    logout(request, refreshToken);
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

async function startChat() {
  console.log("starting chat");
  return json({ startChat: true });
}

export async function action({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "start-chat": {
      return startChat();
    }
    default: {
      return signOut(request);
    }
  }
}

export default function App() {
  const { loginId, defaultTenant } = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Navigation loginId={loginId} defaultTenant={defaultTenant} />
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
        <Chat />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
