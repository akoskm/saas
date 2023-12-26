import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import SkillCard from "~/components/SkillCard";
import getTenantDetails from "~/services/get_tenant_details";
import { verifyUser } from "~/utils/verify_user";
import prisma from "~/prisma";

export async function loader({ request }: LoaderFunctionArgs) {
  const isVerified = await verifyUser(request);
  if (!isVerified) return redirect("/signin");

  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  const skills = await prisma.skill.findMany({
    where: {
      tenantId,
    },
    select: {
      id: true,
      name: true,
      developers: {
        select: {
          id: true,
        },
      },
    },
  });

  const skillsWithDeveloperCount = skills.map((skill) => ({
    ...skill,
    developerCount: skill.developers.length,
  }));

  return json({ skills: skillsWithDeveloperCount });
}

async function addSkill({
  formData,
  tenantId,
}: {
  formData: FormData;
  tenantId: string;
}) {
  const { name } = Object.fromEntries(formData);
  invariant(name, "Missing name");

  await prisma.skill.create({
    data: {
      name: name as string,
      tenantId,
    },
  });

  return json({ ok: true });
}

export async function action({ request }: LoaderFunctionArgs) {
  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  const formData = await request.formData();
  const intent = formData.get("intent");
  switch (intent) {
    case "add": {
      return addSkill({ formData, tenantId });
    }
    default: {
      throw new Error("Unexpected action");
    }
  }
}

export default function Skills() {
  const { skills } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const form = useRef<HTMLFormElement | null>(null);
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (navigation.state === "idle" && actionData?.ok) {
      form?.current?.reset();
    }
  }, [navigation, actionData]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold">Developers</h1>
      <div className="max-w-md">
        <Form
          ref={form}
          id="add-user"
          method="post"
          className="flex flex-col gap-4"
        >
          <div>
            <label htmlFor="email">Name</label>
            <input
              id="name"
              name="name"
              type="name"
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            name="intent"
            value="add"
            disabled={navigation.state === "submitting"}
          >
            Add Skill
          </button>
        </Form>
      </div>
      <h2 className="text-2xl font-bold">Skills</h2>
      <div className="flex flex-col gap-4 max-w-md">
        {skills?.map((skills) => (
          <SkillCard
            id={skills.id}
            key={skills.id}
            name={skills.name}
            developerCount={skills.developerCount}
          />
        ))}
      </div>
    </div>
  );
}
