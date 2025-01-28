"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "O email precisa ser válido." }).trim(),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

type FormState<T> =
  | {
      errors?: {
        [K in keyof T]?: string[];
      };
      message?: string;
    }
  | undefined;

export async function createSession(
  prevState: FormState<LoginForm>,
  formData: FormData
) {
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Simular chamada à API
  const { email, password } = validatedFields.data;
  // fetch /api/auth/login

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }
  );

  if (!response.ok) {
    return {
      message: "Credenciais inválidas",
    };
  }

  redirect("/dashboard");
}
