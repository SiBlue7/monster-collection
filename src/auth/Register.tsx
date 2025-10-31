import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../lib/supabase";
import { ensureDefaultGroup } from "../lib/ensureGroup";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
type FormValues = z.infer<typeof schema>;

export default function Register() {
  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    setServerError(null);

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      // si tu actives la confirmation email, décommente :
      // options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setServerError(error.message);
      return;
    }

    // ✅ Cas confirmation désactivée => session immédiate
    if (data.session) {
      try {
        await ensureDefaultGroup(); // plus besoin de passer userId
      } catch (e: any) {
        setServerError(e.message ?? "Failed to create default group");
        return;
      }
      navigate("/app");
      return;
    }

    // ✅ Cas confirmation activée => afficher un message et faire l’ensure dans /auth/callback
    setServerError("Check your email to confirm your account, then sign in.");
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 w-full max-w-md"
      >
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full rounded border p-2"
            {...registerField("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            className="w-full rounded border p-2"
            {...registerField("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-sm">{errors.password.message}</p>
          )}
        </div>

        {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

        <button
          disabled={isSubmitting}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
        >
          {isSubmitting ? "Création…" : "Create account"}
        </button>
      </form>

      <p className="text-sm mt-4">
        <Link to="/login" className="underline">
          Sign In
        </Link>
      </p>
    </div>
  );
}
