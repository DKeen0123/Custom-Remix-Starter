import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { sessionStorage } from "./session.server";
import bcrypt from "bcryptjs";
import type { User } from "@prisma/client";
import { prisma } from "./db.server";

export let authenticator = new Authenticator<
  Pick<User, "id" | "email" | "name">
>(sessionStorage);

export const createHashedPassword = async (password: string) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const isValidPassword = async (
  password: string,
  hashedPassword: string
) => {
  const isCorrectPassword = await bcrypt.compare(password, hashedPassword);
  return isCorrectPassword;
};

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email");
    let password = form.get("password");

    if (!email || typeof email !== "string") {
      throw new AuthorizationError("Invalid email or password");
    }

    if (!password || typeof password !== "string") {
      throw new AuthorizationError("Invalid email or password");
    }

    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      console.log("no user");
      throw new AuthorizationError("Invalid email or password");
    }

    const isCorrectPassword = await isValidPassword(password, user.password);

    if (!isCorrectPassword) {
      throw new AuthorizationError("Invalid email or password");
    }

    return user;
  }),
  "login"
);
