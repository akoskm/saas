import type {ActionFunctionArgs} from "@remix-run/node";
import { redirect} from "@remix-run/node";
import {Form} from "@remix-run/react";

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  console.log(updates);
  return redirect('/signin');
};

export default function SignUp() {
  return (
    <Form id="signup-form" method="post">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
      </div>
      <button type="submit">Register</button>
    </Form>
  )
}