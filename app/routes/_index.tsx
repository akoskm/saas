import {
  json,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { destroySession, getSession } from "~/sessions";
import faClient from "~/services/fusion_auth_client";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userId = session.get("userId");

  if (userId !== undefined) {
    const {
      response: { user },
    } = await faClient.retrieveUser(userId);
    if (!user?.email) {
      session.unset("userId");
      return json({ loginId: null });
    }
    // Redirect to the home page if they are already signed in.
    return json({ loginId: user.email });
  }
  return json({ loginId: null });
}

export async function action({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const refreshToken = session.get("refreshToken");
  if (refreshToken) {
    faClient.logout(true, refreshToken);
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

export default function Index() {
  const { loginId } = useLoaderData<typeof loader>();

  function renderAuthLinks() {
    if (loginId) return null;
    return (
      <>
        <li>
          <Link to="/signup">Sign Up</Link>
        </li>
        <li>
          <Link to="/signin">Sign In</Link>
        </li>
      </>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-3xl font-bold">Welcome to Remix</h1>
      <ul>
        {renderAuthLinks()}
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
      </ul>
      {loginId && (
        <>
          <p>Signed in as: {loginId}</p>
          <Form id="signout-form" method="post">
            <button type="submit" className="btn-primary">
              Sign Out
            </button>
          </Form>
        </>
      )}
    </div>
  );
}
