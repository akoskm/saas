export default function UserCard({
  id,
  email,
  role,
}: {
  id?: string;
  email?: string;
  role: string;
}) {
  function renderButtons() {
    if (role === "admin") {
      return <p>Cannot delete admin user.</p>;
    }
    return (
      <div className="flex flex-row gap-2">
        <button className="btn-danger">Remove</button>
        <button className="btn-primary">Edit</button>
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
