import { type MetaFunction } from "@remix-run/node";

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
