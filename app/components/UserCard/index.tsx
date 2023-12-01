import { Form, Link } from "@remix-run/react";

export default function UserCard({
  id,
  email,
  role,
}: {
  id?: string;
  email?: string;
  role?: string;
}) {
  function renderButtons() {
    if (role === "admin") {
      return <p>Cannot delete admin user.</p>;
    }
    return (
      <div className="flex flex-row gap-2">
        <Form method="post">
          <input type="hidden" name="userId" value={id} />
          <button className="btn btn-danger" name="intent" value="remove">
            Remove
          </button>
        </Form>
        <Link to={`/team/${id}/edit`} className="btn btn-primary">
          Edit
        </Link>
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
