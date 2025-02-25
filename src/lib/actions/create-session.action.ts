"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "../database/prisma";
import { cookies } from "next/headers";
import { FormState } from "../utils/system";

const loginFormSchema = z.object({
  email: z.string().email({ message: "O email precisa ser válido." }).trim(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginFormSchema>;

export async function createSession(
  _: FormState<LoginForm>,
  formData: FormData
) {
  const validatedFields = loginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const teacher = await prisma.teacher.findFirst({
    where: {
      email,
    },
  });

  if (!teacher) {
    return {
      message: "Senha ou usuário inválido.",
    };
  }

  const { password: teacherPassword, ...rest } = teacher;

  if (teacherPassword !== password) {
    return {
      message: "Senha ou usuário inválido.",
    };
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("session", JSON.stringify(rest), {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  redirect("/");
}
