"use client";

import { useActionState } from "react";
import { createSession } from "../../lib/actions/create-session.action";
import Input from "@/lib/components/Input";


export default function Login() {
  const [state, action, isPending] = useActionState(createSession, undefined);

  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
      <div className="text-sky-950 m-8 text-4xl font-semibold ">Faça o seu Login</div>
        <div className="card border-2 bg-white border-sky-950 rounded text-neutral-content w-96 drop-shadow-lg">
          <div className="card-body  items-center text-center">
            <form action={action}>
              <div className="flex flex-col text-left">
                <label className="text-sky-950 font-semibold" htmlFor="email">Email</label>
                <Input 
                  id="email"
                  name="email"
                  placeholder="Email"
                  aria-describedby="email-error"
                ></Input>
              </div>
              {state?.errors?.email && (
                <p id="email-error" className="error">
                  {state.errors.email[0]}
                </p>
              )}

              <div className="flex flex-col text-left mt-6">
                <label className="text-sky-950 font-semibold" htmlFor="password">Senha</label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  aria-describedby="password-error"
                ></Input>
              </div>
              {state?.errors?.password && (
                <p id="password-error" className="error">
                  {state.errors.password[0]}
                </p>
              )}

              {state?.message && <p className="error">{state.message}</p>}
              <button className="btn w-80 bg-sky-950 mt-6" disabled={isPending} type="submit">
                {isPending ? "Carregando..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
