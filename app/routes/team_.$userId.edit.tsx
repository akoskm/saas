import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import getFusionAuthClient from "~/services/get_fusion_auth_client";
import getTenantDetails from "~/services/get_tenant_details";
import getUserFromSession from "~/services/session";

export async function loader({ request, params }: LoaderFunctionArgs) {
  try {
    await getUserFromSession(request);
  } catch (e) {
    return redirect("/signin");
  }

  // get userId from path
  const { userId } = params;
  invariant(userId, "Missing userId");
  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  const { response } = await getFusionAuthClient(tenantId).retrieveUser(userId);

  return json({
    user:
      {
        email: response.user?.email,
        firstName: response.user?.firstName,
        lastName: response.user?.lastName,
        mobilePhone: response.user?.mobilePhone,
      } || {},
  });
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const { userId } = params;
  invariant(userId, "Missing userId");
  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");
  const formData = await request.formData();
  const { email, firstName, lastName, mobilePhone } =
    Object.fromEntries(formData);

  await getFusionAuthClient(tenantId).updateUser(userId, {
    user: {
      email: email as string,
      firstName: firstName as string,
      lastName: lastName as string,
      mobilePhone: mobilePhone as string,
    },
  });
  return redirect("/team");
}

export default function Edit() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Edit User</h1>
      <div className="max-w-md">
        <Form id="add-user" method="post" className="flex flex-col gap-4">
          <div>
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              className="form-input"
              id="email"
              name="email"
              type="email"
              required
              disabled
              defaultValue={user.email || ""}
            />
          </div>
          <div>
            <label htmlFor="email">First Name</label>
            <input
              className="form-input"
              name="firstName"
              type="text"
              required
              defaultValue={user.firstName || ""}
            />
          </div>
          <div>
            <label htmlFor="email">Last Name</label>
            <input
              className="form-input"
              name="lastName"
              type="text"
              required
              defaultValue={user.lastName || ""}
            />
          </div>
          <div>
            <label htmlFor="email">Mobile Phone</label>
            <input
              className="form-input"
              name="mobilePhone"
              type="text"
              required
              defaultValue={user.mobilePhone || ""}
            />
          </div>
          <input
            className="form-input"
            type="hidden"
            name="email"
            value={user.email}
          />
          <div className="flex flex-row gap-2">
            <button className="btn btn-primary">Save</button>
            <Link to={"/team"} type="button" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
