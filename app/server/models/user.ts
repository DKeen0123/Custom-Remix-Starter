import { makeDomainFunction } from "domain-functions";
import { z } from "zod";
import { prisma } from "../db.server";
import { createHashedPassword } from "../auth.server";

export const signUpSchema = z.object({
  firstName: z.string().optional(),
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export const logInSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export const mutation = makeDomainFunction(signUpSchema)(async (values) => {
  const hashedPassword = await createHashedPassword(values.password);

  //check user already exists
  const user = await prisma.user.findUnique({
    where: {
      email: values.email,
    },
  });

  if (user) {
    return {
      success: false,
      message: "A user already exists with this email",
    };
  }

  try {
    await prisma.user.create({
      data: {
        name: values.firstName,
        email: values.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      message: "User created",
    };
  } catch (error) {
    console.log({ error });
    return {
      success: false,
      message: "Error creating user",
    };
  }
});
