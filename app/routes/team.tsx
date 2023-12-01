import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import Input from "~/components/Input";
import UserCard from "~/components/UserCard";
import { getAppIdForTenant } from "~/services/get_app_id_for_tenant";
import getFusionAuthClient from "~/services/get_fusion_auth_client";
import getTenantDetails from "~/services/get_tenant_details";

export async function loader({ request }: LoaderFunctionArgs) {
  const { tenantId } = await getTenantDetails(request);

  invariant(tenantId, "Missing tenantId");

  const applicationId = await getAppIdForTenant(tenantId);
  const { response } = await getFusionAuthClient(tenantId).searchUsersByQuery({
    search: {
      query: `{"bool":{"must":[{"nested":{"path":"registrations","query":{"bool":{"must":[{"match":{"registrations.applicationId":"${applicationId}"}}]}}}}]}}`,
    },
  });
  const users = response.users?.map((user) => {
    const role = user.registrations?.[0].roles?.[0];
    return {
      id: user.id,
      email: user.email,
      role,
    };
  });
  return json({ users });
}

// create a function that generates an md5 string with the length of 32 characters, don't use substr
function generatePassword() {
  return Math.random().toString(36).slice(-8);
}

export async function action({ request }: LoaderFunctionArgs) {
  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  const applicationId = await getAppIdForTenant(tenantId);
  const formData = await request.formData();
  const { email } = Object.fromEntries(formData);

  invariant(email, "Missing email");

  const registrationRequest = {
    user: {
      email: email as string,
      password: generatePassword(),
    },
    registration: {
      applicationId,
    },
  };
  await getFusionAuthClient(tenantId).register("", registrationRequest);
  return json({ message: "User added" }, { status: 201 });
}

export default function Team() {
  const { users } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Team</h1>
      <div className="max-w-md">
        <Form id="add-user" method="post" className="flex flex-col gap-4">
          <Input id="email" name="email" type="email" label="Email" required />
          <button type="submit" className="btn-primary">
            Add User
          </button>
        </Form>
      </div>
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="flex flex-col gap-4 max-w-md">
        {users?.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            email={user.email}
            role={user.role}
          />
        ))}
      </div>
    </div>
  );
}
