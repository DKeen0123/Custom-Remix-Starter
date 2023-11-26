import {
  redirect,
  type ActionFunction,
  type LoaderFunction,
  json,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { AuthorizationError } from "remix-auth";
import { Form } from "~/form";
import { authenticator } from "~/server/auth.server";
import { formAction } from "~/server/form-action.server";
import { mutation, signUpSchema } from "~/server/models/user";

export const loader: LoaderFunction = async ({ request }) => {
  const authUser = await authenticator.isAuthenticated(request);

  if (authUser) {
    return redirect("/");
  }

  return {};
};

type ActionData = {
  success: boolean;
  message: string;
};

export const action: ActionFunction = async ({ request }) => {
  const createUser = await formAction({
    request,
    schema: signUpSchema,
    mutation: mutation,
  });
  const jsonResponse: ReturnType<typeof mutation> = await createUser.json();

  console.log({ jsonResponse });

  if (!(await jsonResponse).success) {
    const data: ActionData = {
      success: false,
      message: "Error creating user - Email already exists",
    };

    return json(data, {
      status: 401,
    });
  }

  // login user
  try {
    return await authenticator.authenticate("login", request, {
      successRedirect: "/",
      throwOnError: true,
    });
  } catch (error) {
    console.log("error in login: ", JSON.stringify(error));
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) {
      console.log("error is of type Response");
      console.log({ fullerror: JSON.stringify(error) });
      return error;
    }
    if (error instanceof AuthorizationError) {
      console.log(error);

      const data: ActionData = {
        success: false,
        message: error.message,
      };

      return json(data, {
        status: 401,
      });
      // here the error is related to the authentication process
    }

    return {
      success: false,
      error: JSON.stringify(error),
    };
    // here the error is a generic error that another reason may throw
  }
};

export default function SignUp() {
  const actionData = useActionData<ActionData>();
  const [showError, setShowError] = useState(false);

  console.log({ actionData });

  useEffect(() => {
    if (actionData && !actionData?.success) {
      setShowError(true);
    }
  }, [actionData]);

  return (
    <>
      {showError && (
        <div className="mb-4 dark:border-opacity-80 dark:bg-opacity-50 text-center max-w-xs p-4 rounded mx-auto border-red-500 bg-red-300 text-red-600">
          <p>{actionData?.message}</p>
        </div>
      )}
      <Form schema={signUpSchema} />
    </>
  );
}
