import { Form, Link, useSubmit } from "@remix-run/react";

export default function SkillCard({
  id,
  name,
  developerCount,
}: {
  id: string;
  name: string;
  developerCount: number;
}) {
  const submit = useSubmit();

  return (
    <div key={id} className="flex flex-col gap-1">
      <span className="font-bold">{name}</span>
      <div>
        <Link to={`/developers?skill=${id}`} className="underline">
          {developerCount} developer{developerCount > 1 ? "s" : ""}
        </Link>
      </div>
      <div className="flex flex-row gap-2">
        <Link to={`/skills/${id}`} className="btn btn-primary">
          Details
        </Link>
        <Form method="post">
          <input type="hidden" name="userId" value={id} />
          <button
            className="btn btn-danger"
            name="intent"
            value="remove"
            onClick={(event) => {
              event.preventDefault();
              const result = confirm(
                "Are you sure you want to remove this user?",
              );
              if (result) {
                submit(event.currentTarget);
              }
            }}
          >
            Remove
          </button>
        </Form>
      </div>
    </div>
  );
}
