import { Form } from "@remix-run/react";

export default function AuthForm(props: any) {
  return (
    <Form
      id={props.id}
      method={props.method}
      className="mt-20 max-w-xl mx-auto md:max-w-sm flex flex-col space-y-4"
    >
      {props.children}
    </Form>
  );
}
