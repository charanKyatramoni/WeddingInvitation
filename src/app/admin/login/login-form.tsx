"use client";

import { Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { signIn, type LoginState } from "@/app/admin/actions";

const initialState: LoginState = {};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [state, action, isPending] = useActionState(signIn, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input name="next" type="hidden" value={nextPath} />
      <label className="block text-sm font-medium">Email
        <input autoComplete="email" className="mt-2 w-full rounded-xl border border-stone-200 px-4 py-3 outline-none focus:border-rose-600" name="email" required type="email" />
      </label>
      <label className="block text-sm font-medium">Password
        <span className="relative mt-2 block">
          <input autoComplete="current-password" className="w-full rounded-xl border border-stone-200 px-4 py-3 pr-12 outline-none focus:border-rose-600" name="password" required type={showPassword ? "text" : "password"} />
          <button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute inset-y-0 right-0 grid w-12 place-items-center text-stone-500 hover:text-rose-700" onClick={() => setShowPassword((visible) => !visible)} type="button">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>
      {state.error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-800">{state.error}</p>}
      <button className="w-full rounded-xl bg-stone-900 px-4 py-3 font-semibold text-white disabled:opacity-60" disabled={isPending} type="submit">
        {isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
