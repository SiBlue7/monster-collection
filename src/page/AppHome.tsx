import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listCans } from "../api/cans";
import { getMyGroupId } from "../lib/ensureGroup";
import AddCanForm from "../components/AddCanForm";

export default function AppHome() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getMyGroupId().then(setGroupId).catch(console.error);
  }, []);
  const cansQ = useQuery({
    queryKey: ["cans", groupId],
    queryFn: () => listCans(groupId!),
    enabled: !!groupId,
  });

  if (!groupId) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-4 space-y-4">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Ma collection</h1>
        <button
          className="px-3 py-2 bg-black text-white rounded"
          onClick={() => setOpen(true)}
        >
          + Ajouter
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded w-full max-w-md">
            <AddCanForm groupId={groupId} onCreated={() => setOpen(false)} />
          </div>
        </div>
      )}

      {cansQ.isLoading ? (
        <div>Chargement des canettes…</div>
      ) : (
        <ul className="grid gap-3">
          {cansQ.data?.map((c: any) => (
            <li key={c.id} className="border rounded p-3">
              <div className="font-medium">{c.name}</div>
              {c.barcode && (
                <div className="text-xs text-gray-500">EAN: {c.barcode}</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
