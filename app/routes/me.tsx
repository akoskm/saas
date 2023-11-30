import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import getUserFromSession from "~/services/session";

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const user = await getUserFromSession(request);
    const lastLogin = new Date(user.lastLoginInstant ?? "").toLocaleString();
    return json({
      loginId: user.email,
      lastLogin,
    });
  } catch (e) {
    return redirect("/signin");
  }
}

export default function Me() {
  const { loginId, lastLogin } = useLoaderData<typeof loader>();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1 className="text-3xl font-bold">Welcome {loginId}</h1>
      <p>
        Last login: <strong>{lastLogin}</strong>
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
