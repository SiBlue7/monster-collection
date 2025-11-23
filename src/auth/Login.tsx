import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});
type FormValues = z.infer<typeof schema>;

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    navigate("/app");
  };

  const inputClass =
    "w-full rounded-lg border px-4 py-3 text-base " +
    "bg-gray-900 text-gray-100 border-gray-700 " +
    "placeholder-gray-600 " +
    "focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200 shadow-inner";

  const labelClass =
    "block text-sm font-bold mb-2 text-gray-300 uppercase tracking-wide";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 to-black text-gray-100 p-4 selection:bg-green-500 selection:text-black">
      <div className="w-full max-w-md bg-gray-950 rounded-2xl border border-gray-800 shadow-[0_0_40px_-10px_rgba(34,197,94,0.3)] p-8 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-600 to-transparent opacity-80"></div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">
            Monster <span className="text-green-500 not-italic">Login</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Connectez-vous pour gérer votre collection
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className={labelClass}>Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="votre@email.com"
                className={inputClass}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              className={inputClass}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {serverError && (
            <div className="p-3 rounded bg-red-900/20 border border-red-800/50 text-center">
              <p className="text-red-400 text-sm font-medium">{serverError}</p>
            </div>
          )}

          <button
            disabled={isSubmitting}
            className="w-full rounded-lg bg-green-600 px-6 py-3.5 text-lg font-bold uppercase tracking-wider text-black shadow-lg shadow-green-900/20
                       hover:bg-green-500 hover:shadow-green-500/40 hover:-translate-y-0.5
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
                       transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Connexion...
              </span>
            ) : (
              "Accéder à la collection"
            )}
          </button>
        </form>

        <div className="mt-8 text-center pt-6 border-t border-gray-800">
          <p className="text-gray-400 text-sm">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-green-500 font-bold hover:text-green-400 hover:underline transition-colors"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>

      <div className="absolute bottom-4 text-gray-700 text-xs font-mono">
        MONSTER COLLECTION APP v1.0
      </div>
    </div>
  );
}
