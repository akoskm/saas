import { Form } from "@remix-run/react";
import { VariableIcon } from "@heroicons/react/24/outline";

export default function Chat() {
  return (
    <div className="fixed bottom-0 right-0 mb-4 mr-4 z-50">
      <div className="bg-white rounded-lg w-64 shadow-lg p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <VariableIcon className="block h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <div className="text-xl font-bold">Hello! How can I help you?</div>
          </div>
        </div>
        <Form id="signout-form" method="post">
          <div className="mt-4">
            <textarea
              className="form-textarea w-full"
              placeholder="Type your message"
            ></textarea>
          </div>
          <div className="mt-4">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full"
              name="intent"
              value="start-chat"
            >
              Send
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
