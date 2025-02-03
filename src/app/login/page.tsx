"use client";

import { useActionState } from "react";
import { createSession } from "../../lib/actions/create-session.action";
import Input from "@/lib/components/Input";

export default function Login() {
  const [state, action, isPending] = useActionState(createSession, undefined);

  return (
    <>
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
              <div className="flex flex-col text-left">
                <Input
                  id="email"
                  name="email"
                  label="Email"
                  placeholder="Email"
                  aria-describedby="email-error"
                  htmlFor="email"
                />
              </div>
              {state?.errors?.email && (
                <p id="email-error" className="error text-red-900 mt-2 ">
                  {state.errors.email[0]}
                </p>
              )}

              <div className="flex flex-col text-left mt-6">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  label="Senha"
                  placeholder="Digite sua senha"
                  aria-describedby="password-error"
                  htmlFor="password"
                />
              </div>
              {state?.errors?.password && (
                <p id="password-error" className="error text-red-900 mt-2">
                  {state.errors.password[0]}
                </p>
              )}
              {state?.message && <p className="error">{state.message}</p>}
              <button
                id="buttonLogin"
                className="btn w-80 bg-sky-950 hover:bg-sky-900 mt-6"
                disabled={isPending}
                type="submit"
              >
                {isPending ? <span className="loading loading-spinner bg-sky-950 loading-xs"></span>: "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
