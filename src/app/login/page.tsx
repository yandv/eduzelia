"use client";

import { useActionState } from "react";
import { createSession } from "../../lib/actions/create-session.action";

export default function Login() {
  const [state, action, isPending] = useActionState(createSession, undefined);

  return (
    <form action={action}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          aria-describedby="email-error"
        />
      </div>
      {state?.errors?.email && (
        <p id="email-error" className="error">
          {state.errors.email[0]}
        </p>
      )}

      <div>
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          name="password"
          type="password"
          aria-describedby="password-error"
        />
      </div>
      {state?.errors?.password && (
        <p id="password-error" className="error">
          {state.errors.password[0]}
        </p>
      )}

      {state?.message && <p className="error">{state.message}</p>}

      <button disabled={isPending} type="submit">
        {isPending ? "Carregando..." : "Login"}
      </button>
    </form>
  );
}
