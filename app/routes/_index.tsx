import { type MetaFunction } from "@remix-run/node";
import { BuildingOfficeIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
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
      <div className="flex flex-row gap-4">
        <Link className="btn-primary" to="/signup">
          Personal sign up
          <UserIcon className="block h-6 w-6" aria-hidden="true" />
        </Link>
        <Link className="btn-primary" to="/org-signup">
          Sign Up as an Organization
          <BuildingOfficeIcon className="block h-6 w-6" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
