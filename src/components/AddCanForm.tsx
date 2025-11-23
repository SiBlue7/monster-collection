import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { createCan } from "../api/cans";
import BarcodeScanner from "./BarcodeScanner";

const schema = z.object({
  name: z.string().min(1, "Nom obligatoire"),
  barcode: z
    .string()
    .min(1, "Le code-barres est obligatoire")
    .regex(/^\d+$/, "Le code-barres doit contenir uniquement des chiffres")
    .max(20, "Code-barres trop long"),
  imageFile: z
    .any()
    .transform((v) => {
      if (v instanceof File) return v;
      if (v && typeof v === "object" && "length" in v && v[0] instanceof File) {
        return v[0] as File;
      }
      return null;
    })
    .optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AddCanForm({
  groupId,
  onCreated,
}: {
  groupId: string;
  onCreated?: () => void;
}) {
  const qc = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", barcode: "", imageFile: undefined, notes: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const file = watch("imageFile") as File | null | undefined;

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createCan({
        groupId,
        name: data.name.trim(),
        barcode: data.barcode?.trim() || null,
        imageFile: data.imageFile instanceof File ? data.imageFile : null,
        notes: data.notes?.trim() || null,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cans", groupId] });
      reset();
      onCreated?.();
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      console.log("Form submit:", values);
      await mutation.mutateAsync(values);
    } catch (e) {
      const err = e as PostgrestError & { code?: string };
      if (err?.code === "23505") {
        setServerError("Une canette avec ce code-barres existe déjà.");
      } else {
        setServerError(err?.message ?? "Échec de l'ajout de la canette.");
      }
    }
  };

  const inputClass =
    "w-full rounded-lg border px-4 py-2 text-base " +
    "bg-gray-900 text-gray-100 border-gray-700 " +
    "placeholder-gray-500 " +
    "focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all duration-200";

  const labelClass = "block text-sm font-semibold mb-1 text-gray-200";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 p-8 bg-gray-950 text-gray-100 rounded-xl shadow-lg border border-gray-800"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-green-500">
        Ajouter une nouvelle Canette
      </h2>

      <div>
        <label className={labelClass}>Nom de la canette</label>
        <input
          className={inputClass}
          placeholder="Ex: Monster Ultra White"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Code-barres</label>
        <div className="flex gap-3">
          {" "}
          <input
            className={inputClass + " flex-grow"}
            placeholder="Scanner ou taper le code-barres"
            {...register("barcode")}
          />
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-100 text-sm rounded-lg font-medium transition-colors border border-gray-700 hover:border-green-500/50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 inline-block mr-1"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 4.5h16.5m-16.5 2.25h16.5m-16.5 2.25h16.5m-16.5 2.25h16.5m-16.5 2.25h16.5M12 9v3.75m-9.75-5.625l-.325 5.618C2.559 13.91 2.852 15 3.9 15h9.75V4.5H3.75z"
              />
            </svg>
            Scanner
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Le scanner fonctionne mieux en lumière suffisante.
        </p>
        {errors.barcode && (
          <p className="mt-1 text-xs text-red-500">{errors.barcode.message}</p>
        )}
      </div>

      {showScanner && (
        <div className="border border-gray-700 rounded-lg p-3 bg-gray-900">
          <BarcodeScanner
            onResult={(code) =>
              setValue("barcode", code, { shouldDirty: true })
            }
            onClose={() => setShowScanner(false)}
          />
        </div>
      )}

      <div>
        <label className={labelClass}>Ajouter une image de la canette</label>
        <Controller
          name="imageFile"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <input
              ref={ref}
              type="file"
              accept="image/*"
              capture="environment"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-600 file:text-white
                hover:file:bg-green-700 focus:file:outline-none focus:file:ring-2 focus:file:ring-green-500"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                console.log("Selected file:", f);
                onChange(f);
              }}
            />
          )}
        />
        {file ? (
          <p className="text-xs text-gray-500 mt-2">
            {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        ) : null}
      </div>

      <div>
        <label className={labelClass}>Notes (optionnel)</label>
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Ajoutez des détails, saveur, collection, etc."
          {...register("notes")}
        />
      </div>

      {serverError && (
        <div className="p-4 rounded-lg bg-red-900/30 border border-red-700">
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-bold text-black shadow-md
                   hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" // Bouton vert néon
      >
        {mutation.isPending ? "Ajout en cours..." : "Ajouter la canette"}
      </button>
    </form>
  );
}
