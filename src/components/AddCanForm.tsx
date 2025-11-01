import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCan } from "../api/cans";
import BarcodeScanner from "./BarcodeScanner";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  barcode: z.string().optional(),
  imageFile: z
    .custom<File | null>()
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
  onCreated: () => void;
}) {
  const qc = useQueryClient();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const [serverError, setServerError] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const imageList = watch("imageFile");

  const mutation = useMutation({
    mutationFn: (data: FormValues) =>
      createCan({
        groupId,
        name: data.name.trim(),
        barcode: data.barcode?.trim() || null,
        imageFile: data.imageFile ?? null,
        notes: data.notes?.trim() || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cans", groupId] });
      onCreated?.();
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      await mutation.mutateAsync(values);
    } catch (e: any) {
      if (e?.code === "23505") {
        setServerError("A can with this barcode already exists.");
      } else {
        setServerError(e.message ?? "Failed to create can.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label className="block text-sm mb-1">Nom</label>
        <input
          className="w-full rounded border p-2"
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
            className="flex-1 rounded border p-2"
            placeholder="EAN/UPC"
            {...register("barcode")}
          />
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="px-3 py-2 border rounded"
          >
            Scanner
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Le scan fonctionne mieux en lumière suffisante.
        </p>
      </div>

      {showScanner && (
        <div className="border rounded p-2">
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
          {...register("imageFile")}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            // astuce: RHF n’associe pas bien File → on set manuellement
            // @ts-ignore
            setValue("imageFile", f, { shouldDirty: true });
          }}
        />
        {imageList && (
          <p className="text-xs text-gray-500 mt-1">
            {imageList.name} • {(imageList.size / 1024 / 1024).toFixed(2)} MB
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm mb-1">Notes (optionnel)</label>
        <textarea
          className="w-full rounded border p-2"
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
