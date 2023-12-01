import { Form, Link, useSubmit } from "@remix-run/react";

export default function UserCard({
  id,
  email,
  role,
}: {
  id?: string;
  email?: string;
  role?: string;
}) {
  const submit = useSubmit();

  function renderButtons() {
    if (role === "admin") {
      return <p>Cannot delete admin user.</p>;
    }
    return (
      <div className="flex flex-row gap-2">
        <Link to={`/team/${id}/edit`} className="btn btn-primary">
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
    );
  }

  return (
    <div key={id} className="flex flex-col gap-1">
      <span className="font-bold">{email}</span>
      <span className="text-sm text-gray-500">{id}</span>
      {renderButtons()}
    </div>
  );
}
