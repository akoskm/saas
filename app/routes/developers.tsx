import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useRef, useEffect } from "react";
import { json, redirect, type LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import getTenantDetails from "~/services/get_tenant_details";
import { PrismaClient } from "@prisma/client";
import DeveloperCard from "~/components/DeveloperCard";
import { verifyUser } from "~/utils/verify_user";

async function addDeveloper({
  formData,
  tenantId,
}: {
  formData: FormData;
  tenantId: string;
}) {
  const { email, name } = Object.fromEntries(formData);
  invariant(name, "Missing name");
  invariant(email, "Missing email");

  const prisma = new PrismaClient();
  await prisma.developer.create({
    data: {
      name: name as string,
      email: email as string,
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
      return addDeveloper({ formData, tenantId });
    }
    default: {
      throw new Error("Unexpected action");
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const isVerified = await verifyUser(request);
  if (!isVerified) return redirect('/signin');

  const { tenantId } = await getTenantDetails(request);
  invariant(tenantId, "Missing tenantId");

  // get devId from path
  let { searchParams } = new URL(request.url);
  let skill = searchParams.get("skill");

  const prisma = new PrismaClient();
  const developers = await prisma.developer.findMany({
    where: {
      tenantId,
      ...(skill ? { skills: { some: { id: skill } } } : {}),
    },
    include: {
      skills: true,
    },
  });

  return json({ developers });
}

export default function Devs() {
  const { developers } = useLoaderData<typeof loader>();
  const form = useRef<HTMLFormElement | null>(null);
  const navigation = useNavigation();
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
          <div>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
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
            Add Developer
          </button>
        </Form>
      </div>
      <h2 className="text-2xl font-bold">Developers</h2>
      <div className="flex flex-col gap-4 max-w-md">
        {developers?.map((developer) => (
          <DeveloperCard
            id={developer.id}
            key={developer.id}
            name={developer.name}
            email={developer.email}
            mobilePhone={developer.mobilePhone}
            skills={developer.skills}
            bio={developer.bio}
          />
        ))}
      </div>
    </div>
  );
}
