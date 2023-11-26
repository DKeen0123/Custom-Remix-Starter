import type { DataFunctionArgs } from "@remix-run/node";
import { authenticator } from "~/server/auth.server";

export async function action({ request }: DataFunctionArgs) {
  return await authenticator.logout(request, { redirectTo: "/" });
}
