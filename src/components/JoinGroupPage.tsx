import { useState } from "react";
import { joinGroupWithCode } from "../api/groups";
import { useNavigate } from "react-router-dom";

export default function JoinGroupPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const groupId = await joinGroupWithCode(code.trim());
      console.log("Joined group", groupId);
      navigate("/app");
    } catch (e: any) {
      setError(e.message ?? "Code invalide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-white">
          Rejoindre une collection
        </h1>
        <p className="text-sm text-gray-400">
          Colle le code que ton ami t&apos;a envoyé.
        </p>

        <input
          className="w-full border border-gray-700 bg-black/40 rounded px-3 py-2 font-mono text-sm text-green-400"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="ex: a3f9c2d1"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-500 text-black font-bold rounded py-2 disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Rejoindre la collection"}
        </button>
      </form>
    </div>
  );
}
