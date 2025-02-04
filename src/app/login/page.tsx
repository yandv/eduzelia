"use client";

import { useActionState } from "react";
import { createSession } from "../../lib/actions/create-session.action";
import FormTextInput from "@/lib/components/form/FormTextInput";
import { Button } from "@/lib/components/ui/Button";
import FormFieldErrorMessage from "@/lib/components/form/FormFieldErrorMessage";
import FormErrorMessage from "@/lib/components/form/FormErrorMessage";

export default function Login() {
  const [formState, action, isPending] = useActionState(
    createSession,
    undefined
  );

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-sky-950 m-8 text-4xl font-semibold ">
        Faça o seu Login
      </div>
      <div
        id="card"
        className="card border-2 bg-white border-sky-950 rounded text-neutral-content w-96 drop-shadow-lg"
      >
        <div id="cardBody" className="card-body  items-center text-center">
          <form id="formLogin" action={action}>
            <FormTextInput
              id="email"
              name="email"
              label="Email"
              placeholder="Email"
              aria-describedby="email-error"
              htmlFor="email"
            />
            <FormFieldErrorMessage fieldName="email" formState={formState} />

            <FormTextInput
              id="password"
              name="password"
              type="password"
              label="Senha"
              placeholder="Digite sua senha"
              aria-describedby="password-error"
              htmlFor="password"
              className="mt-4"
            />
            <FormFieldErrorMessage fieldName="password" formState={formState} />

            <FormErrorMessage formState={formState} />

            <Button
              id="buttonLogin"
              className="w-full mt-6"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <span className="loading loading-spinner bg-sky-950 loading-xs"></span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
