import type { Skill } from "@prisma/client";
import { Form, Link, useSubmit } from "@remix-run/react";

export default function UserCard({
  id,
  email,
  name,
  mobilePhone,
  skills,
}: {
  id: string;
  email: string;
  name: string;
  mobilePhone: string | null;
  skills: Array<Skill>;
}) {
  const submit = useSubmit();

  return (
    <div key={id} className="flex flex-col gap-1">
      <span className="text-lg">{name}</span>
      <span>{email}</span>
      <span>{mobilePhone}</span>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill.id}
            className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {skill.name}
          </span>
        ))}
      </div>
      <div className="flex flex-row gap-2">
        <Link to={`/developers/${id}/edit`} className="btn btn-primary">
          Edit
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
