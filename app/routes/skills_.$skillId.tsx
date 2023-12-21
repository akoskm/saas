import { PrismaClient } from "@prisma/client";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import getTenantDetails from "~/services/get_tenant_details";
import getUserFromSession from "~/services/session";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  try {
    await getUserFromSession(request);
  } catch (e) {
    return redirect("/signin");
  }

  // get skillId from path
  const { skillId } = params;
  invariant(skillId, "Missing skillId");

  const prisma = new PrismaClient();
  const skill = await prisma.skill.findUnique({
    where: {
      id: skillId,
    },
  });
  return json({ skill });
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const { skillId } = params;
  invariant(skillId, "Missing skillId");

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");

  const prisma = new PrismaClient();
  await prisma.skill.update({
    where: {
      id: skillId,
    },
    data: {
      name: name as string,
      description: description as string,
    },
  });

  return redirect("/skills");
}

export default function Edit() {
  const { skill } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Edit Skill</h1>
      <div className="max-w-md">
        <Form id="add-user" method="post" className="flex flex-col gap-4">
          <div>
            <label htmlFor="email">Name</label>
            <input
              className="form-input"
              name="name"
              type="text"
              required
              defaultValue={skill.name || ""}
            />
          </div>
          <div>
            <label htmlFor="email">Description</label>
            <textarea
              className="form-input"
              name="description"
              required
              defaultValue={skill.description || ""}
            />
          </div>
          <input
            className="form-input"
            type="hidden"
            name="id"
            value={skill.id}
          />
          <div className="flex flex-row gap-2">
            <button className="btn btn-primary">Save</button>
            <Link to={"/skills"} type="button" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
