import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import { createCan } from "../api/cans";
import BarcodeScanner from "./BarcodeScanner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  barcode: z.string().optional(),
  imageFile: z
    .custom<File | null | undefined>()
    .transform((v) => (v instanceof File ? v : null))
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
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", barcode: "", imageFile: undefined, notes: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);

  const file = watch("imageFile"); // File | null | undefined

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createCan({
        groupId,
        name: data.name.trim(),
        barcode: data.barcode?.trim() || null,
        imageFile: data.imageFile ?? null,
        notes: data.notes?.trim() || null,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["cans", groupId] });
      reset(); // vide le formulaire
      onCreated?.(); // ferme la modale (si fourni)
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await mutation.mutateAsync(values);
    } catch (e) {
      const err = e as PostgrestError & { code?: string };
      if (err?.code === "23505") {
        setServerError("A can with this barcode already exists.");
      } else {
        setServerError(err?.message ?? "Failed to create can.");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 p-4"
      // évite que le navigateur “auto-dark” inverse les champs
      style={{ colorScheme: "light dark" }}
    >
      <div>
        <label className="block text-sm mb-1">Nom</label>
        <input
          className="w-full rounded border p-2
                     bg-white text-zinc-900 border-zinc-300 placeholder-zinc-400
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:placeholder-zinc-500"
          placeholder="Monster Ultra..."
          {...register("name")}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Code-barres</label>
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border p-2
                       bg-white text-zinc-900 border-zinc-300 placeholder-zinc-400
                       focus:outline-none focus:ring-2 focus:ring-emerald-500
                       dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700 dark:placeholder-zinc-500"
            placeholder="EAN/UPC"
            {...register("barcode")}
          />
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="px-3 py-2 border rounded
                       bg-white border-zinc-300
                       dark:bg-zinc-800 dark:border-zinc-700"
          >
            Scanner
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Le scan fonctionne mieux en lumière suffisante.
        </p>
      </div>

      {showScanner && (
        <div className="border rounded p-2 dark:border-zinc-700">
          <BarcodeScanner
            onResult={(code) =>
              setValue("barcode", code, { shouldDirty: true })
            }
            onClose={() => setShowScanner(false)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Image</label>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="block w-full text-sm
                     file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0
                     file:bg-zinc-200 file:text-zinc-900
                     dark:file:bg-zinc-700 dark:file:text-zinc-100"
          {...register("imageFile")}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            setValue("imageFile", f, { shouldDirty: true });
          }}
        />
        {file ? (
          <p className="text-xs text-gray-500 mt-1">
            {file.name} • {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm mb-1">Notes (optionnel)</label>
        <textarea
          className="w-full rounded border p-2
                     bg-white text-zinc-900 border-zinc-300
                     focus:outline-none focus:ring-2 focus:ring-emerald-500
                     dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700"
          rows={3}
          {...register("notes")}
        />
      </div>

      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting || mutation.isPending}
        className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
      >
        {mutation.isPending ? "Ajout…" : "Ajouter la canette"}
      </button>
    </form>
  );
}
