import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { updateCan } from "../api/cans";

const schema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  barcode: z.string().optional(),
  notes: z.string().optional(),
  newImageFile: z.any().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function EditCanForm({
  can,
  groupId,
  onClose,
}: {
  can: any;
  groupId: string;
  onClose?: () => void;
}) {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: can.name ?? "",
      barcode: can.barcode ?? "",
      notes: can.notes ?? "",
      newImageFile: undefined,
    },
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      updateCan({
        id: can.id,
        groupId,
        name: data.name,
        barcode: data.barcode ?? null,
        notes: data.notes ?? null,
        newImageFile:
          data.newImageFile instanceof File ? data.newImageFile : null,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cans", groupId] });
      onClose?.();
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await mutation.mutateAsync(values);
    } catch (e) {
      const err = e as PostgrestError & { code?: string };
      setServerError(err?.message ?? "Échec de la mise à jour.");
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
        Modifier la Canette
      </h2>

      <div>
        <label className={labelClass}>Nom de la canette</label>
        <input
          className={inputClass}
          placeholder="Ex: Monster Original Green"
          {...register("name")}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>Code-barres</label>
        <input
          className={inputClass}
          placeholder="Scanner ou taper le code-barres"
          {...register("barcode")}
        />
      </div>

      <div>
        <label className={labelClass}>Notes additionnelles</label>
        <textarea
          rows={4}
          className={inputClass}
          placeholder="Ajoutez des détails, saveur, collection..."
          {...register("notes")}
        />
      </div>

      <div>
        <label className={labelClass}>Ajouter/Changer l'image</label>
        <Controller
          name="newImageFile"
          control={control}
          render={({ field: { onChange, ref } }) => (
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-green-600 file:text-white
                hover:file:bg-green-700 focus:file:outline-none focus:file:ring-2 focus:file:ring-green-500" // Bouton fichier vert Monster
              onChange={(e) => onChange(e.target.files?.[0] ?? null)}
            />
          )}
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
        className="w-full rounded-lg bg-green-600 px-6 py-3 text-lg font-bold text-white shadow-md
                   hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500
                   disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200" // Bouton vert néon
      >
        {mutation.isPending
          ? "Sauvegarde en cours..."
          : "Sauvegarder les modifications"}
      </button>
    </form>
  );
}
