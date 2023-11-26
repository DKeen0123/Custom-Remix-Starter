import type { DataFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/server/auth.server";
import { Button, buttonVariants } from "~/ui/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader = async ({ request }: DataFunctionArgs) => {
  const authUser = await authenticator.isAuthenticated(request);

  return {
    authUser,
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      {data.authUser?.id ? (
        <>
          <Form action="/action/logout" method="POST">
            <Button variant="outline" type="submit">
              Logout
            </Button>
          </Form>
        </>
      ) : (
        <>
          <Link to="/signup" className={buttonVariants({ variant: "default" })}>
            Signup
          </Link>
          <Link to="/login" className={buttonVariants({ variant: "outline" })}>
            Login
          </Link>
        </>
      )}
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
