import type { Skill } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import getTenantDetails from "~/services/get_tenant_details";
import getUserFromSession from "~/services/session";
import Select from "react-select";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  try {
    await getUserFromSession(request);
  } catch (e) {
    return redirect("/signin");
  }

  // get devId from path
  const { devId } = params;
  invariant(devId, "Missing devId");

  const prisma = new PrismaClient();
  const developer = await prisma.developer.findUnique({
    where: {
      id: devId,
    },
    include: {
      skills: true,
    },
  });
  invariant(developer, "Missing developer");
  const skills = await prisma.skill.findMany({
    where: {
      tenantId,
    },
  });
  const skillOptions = skills.map((skill: Skill) => ({
    value: skill.id,
    label: skill.name,
  }));
  const developerSkills = developer.skills.map((skill: Skill) => ({
    value: skill.id,
    label: skill.name,
  }));

  return json({
    developer: {
      ...developer,
      skills: developerSkills,
    },
    skills: skillOptions,
  });
}

export async function action({ request, params }: LoaderFunctionArgs) {
  const { devId } = params;
  invariant(devId, "Missing devId");

  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");
  const mobilePhone = formData.get("mobilePhone");
  const bio = formData.get("bio");
  const skills = formData.getAll("skills").map((skillId) => skillId as string);

  const prisma = new PrismaClient();
  await prisma.developer.update({
    where: {
      id: devId,
    },
    data: {
      name: name as string,
      email: email as string,
      mobilePhone: mobilePhone as string,
      bio: bio as string,
      skills: {
        set: skills.map((skillId) => ({ id: skillId })),
      },
    },
  });

  return redirect("/developers");
}

export default function Edit() {
  const { developer, skills } = useLoaderData<typeof loader>();

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
              defaultValue={developer.email || ""}
            />
          </div>
          <div>
            <label htmlFor="email">First Name</label>
            <input
              className="form-input"
              name="name"
              type="text"
              required
              defaultValue={developer.name || ""}
            />
          </div>
          <div>
            <label htmlFor="email">Mobile Phone</label>
            <input
              className="form-input"
              name="mobilePhone"
              type="text"
              defaultValue={developer.mobilePhone || ""}
            />
          </div>
          <div>
            <label htmlFor="skills">Skills</label>
            <Select
              defaultValue={developer.skills}
              isMulti
              name="skills"
              options={skills}
              className="basic-multi-select"
              classNamePrefix="select"
            />
          </div>
          <div>
            <label htmlFor="email">Bio</label>
            <textarea
              className="form-input"
              name="bio"
              defaultValue={developer.bio || ""}
            />
          </div>
          <input
            className="form-input"
            type="hidden"
            name="id"
            value={developer.id}
          />
          <div className="flex flex-row gap-2">
            <button className="btn btn-primary">Save</button>
            <Link
              to={"/developers"}
              type="button"
              className="btn btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}
