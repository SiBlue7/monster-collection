import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCans, deleteCan } from "../api/cans";
import { ensureDefaultGroup } from "../lib/ensureGroup";
import AddCanForm from "../components/AddCanForm";
import EditCanForm from "../components/EditCanForm";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

type GroupSummary = {
  id: string;
  name: string;
  role: string;
  inviteCode: string | null;
};

const MonsterButton = ({
  children,
  onClick,
  variant = "primary",
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}) => {
  const baseStyle =
    "relative px-4 md:px-6 py-3 font-black uppercase tracking-wider transform transition-all duration-200 skew-x-[-10deg] hover:skew-x-[-10deg] active:scale-95 border-2 group overflow-hidden text-sm md:text-base whitespace-nowrap";

  const variants = {
    primary:
      "bg-transparent border-[#39ff14] text-[#39ff14] hover:bg-[#39ff14] hover:text-black shadow-[0_0_10px_rgba(57,255,20,0.2)] hover:shadow-[0_0_30px_rgba(57,255,20,0.6)]",
    secondary:
      "bg-gray-900 border-gray-700 text-gray-300 hover:border-white hover:text-white",
    danger:
      "bg-transparent border-red-600 text-red-600 hover:bg-red-600 hover:text-black hover:shadow-[0_0_20px_rgba(220,38,38,0.5)]",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      <span className="block transform skew-x-[10deg]">{children}</span>
    </button>
  );
};

export default function AppHome() {
  const [groupId, setGroupId] = useState<string | null>(null);
  const [groups, setGroups] = useState<GroupSummary[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);

  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    (async () => {
      try {
        setLoadingGroups(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          navigate("/login");
          return;
        }

        const fetchMemberships = async () => {
          const { data, error } = await supabase
            .from("group_members")
            .select("group_id, role, groups(name, invite_code)")
            .eq("user_id", user.id);
          if (error) throw error;
          return (data ?? []) as any[];
        };

        let memberships = await fetchMemberships();
        if (!memberships || memberships.length === 0) {
          await ensureDefaultGroup();
          memberships = await fetchMemberships();
        }

        const mapped: GroupSummary[] = memberships.map((row: any) => ({
          id: row.group_id,
          name: row.groups?.name ?? "Ma collection",
          role: row.role,
          inviteCode: row.groups?.invite_code ?? null,
        }));

        setGroups(mapped);
        if (mapped.length > 0) {
          const first = mapped[0];
          setGroupId((prev) => prev ?? first.id);
          setInviteCode((prev) => prev ?? first.inviteCode ?? null);
        }
        setLoadingGroups(false);
      } catch (e) {
        console.error(e);
        setLoadingGroups(false);
      }
    })();
  }, [navigate]);

  const cansQ = useQuery({
    queryKey: ["cans", groupId],
    queryFn: () => listCans(groupId!),
    enabled: !!groupId,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCan({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cans", groupId] });
    },
  });

  if (loadingGroups || !groupId || cansQ.isLoading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
        <div className="w-16 h-16 border-4 border-[#39ff14] border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_20px_#39ff14]"></div>
        <div className="text-[#39ff14] text-xl md:text-2xl font-black tracking-[0.2em] uppercase animate-pulse">
          Loading The Vault...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-gray-100 font-sans selection:bg-[#39ff14] selection:text-black overflow-x-hidden flex flex-col">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-0 w-[50%] h-[500px] bg-green-900/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[500px] bg-blue-900/5 rounded-full blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="w-full px-4 md:px-8 py-4 flex justify-between items-center">
          <Link to="/app" className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#39ff14] skew-x-[-10deg] flex items-center justify-center shadow-[0_0_15px_#39ff14]">
              <span className="font-black text-black text-xl md:text-2xl skew-x-[10deg]">
                M
              </span>
            </div>
            <h1 className="text-xl md:text-3xl font-black tracking-tighter text-white italic hidden sm:block">
              CAN<span className="text-[#39ff14]">VAULT</span>
            </h1>
          </Link>

          <button
            className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest border border-transparent hover:border-red-900/50 px-3 py-1"
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          >
            // DISCONNECT
          </button>
        </div>
        <div className="h-[1px] w-full bg-gradient-to-r from-[#39ff14]/0 via-[#39ff14] to-[#39ff14]/0 opacity-50" />
      </nav>

      <main className="relative z-10 w-full flex-grow px-4 md:px-8 py-6 md:py-8 space-y-8">
        <header className="bg-[#0e0e0e] border border-white/5 p-6 md:p-8 relative overflow-hidden group w-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#39ff14]/10 to-transparent pointer-events-none" />

          <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 relative z-10">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-4">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tight leading-none">
                  TON{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#39ff14] to-emerald-600">
                    ARSENAL
                  </span>
                </h2>
                <span className="px-3 py-1 bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14] text-xs md:text-sm font-bold skew-x-[-10deg]">
                  {cansQ.data?.length || 0} UNITÉS
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full max-w-2xl">
                <div className="flex flex-col gap-1 w-full sm:w-auto flex-grow">
                  <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold pl-1">
                    Collection Active
                  </label>
                  <div className="relative w-full">
                    <select
                      value={groupId ?? ""}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setGroupId(newId);
                        const g = groups.find((gg) => gg.id === newId);
                        setInviteCode(g?.inviteCode ?? null);
                      }}
                      className="appearance-none w-full bg-black border border-gray-700 hover:border-[#39ff14] text-white font-bold uppercase py-3 pl-4 pr-10 focus:outline-none focus:shadow-[0_0_15px_rgba(57,255,20,0.3)] transition-all cursor-pointer"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name} {g.role !== "owner" ? `[${g.role}]` : ""}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#39ff14]">
                      <svg
                        className="fill-current h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 justify-start xl:justify-end">
              <MonsterButton
                variant="secondary"
                onClick={() => setShareOpen(true)}
                className="flex-1 sm:flex-none"
              >
                Partager
              </MonsterButton>
              <MonsterButton
                variant="primary"
                onClick={() => setOpen(true)}
                className="flex-1 sm:flex-none"
              >
                + Ajouter
              </MonsterButton>
            </div>
          </div>
        </header>

        {cansQ.data?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 border border-dashed border-gray-800 bg-gray-900/20 mx-auto w-full max-w-3xl">
            <div className="text-6xl mb-4 opacity-20 grayscale">💀</div>
            <p className="text-xl font-bold text-gray-500 uppercase tracking-widest">
              Zone Vide
            </p>
            <p className="text-sm text-gray-600">
              Initialise ta collection maintenant.
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 md:gap-8 w-full">
            {cansQ.data?.map((c: any) => (
              <li
                key={c.id}
                className="group relative bg-[#0a0a0a] flex flex-col transition-all duration-500 hover:-translate-y-2 hover:z-10"
              >
                <div className="absolute -inset-[1px] bg-gradient-to-b from-gray-800 to-transparent group-hover:from-[#39ff14] group-hover:to-[#39ff14]/20 transition-all duration-500 opacity-50 group-hover:opacity-100 blur-[1px]" />

                <div className="relative z-10 h-full flex flex-col bg-[#0a0a0a]">
                  <div className="relative h-64 xl:h-80 bg-gradient-to-b from-[#151515] to-[#050505] p-4 overflow-hidden flex items-center justify-center">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                      }}
                    ></div>

                    {c.signed_url ? (
                      <img
                        src={c.signed_url}
                        alt={c.name}
                        className="h-full w-auto object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                      />
                    ) : (
                      <div className="text-gray-800 font-black text-6xl select-none">
                        ?
                      </div>
                    )}

                    {c.barcode && (
                      <div className="absolute top-2 right-2 bg-black border border-gray-800 px-2 py-1 z-20">
                        <p className="text-[10px] text-gray-400 font-mono tracking-widest">
                          {c.barcode}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 xl:p-5 flex flex-col flex-grow border-t border-gray-900 relative">
                    <div className="absolute top-0 left-0 h-[2px] w-0 bg-[#39ff14] group-hover:w-full transition-all duration-500 ease-out" />

                    <h3 className="text-lg xl:text-xl font-black text-white uppercase leading-none mb-2 group-hover:text-[#39ff14] transition-colors truncate">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium line-clamp-2 mb-4 min-h-[2.5em]">
                      {c.notes || "Aucune description."}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setEditing(c)}
                        className="py-2 text-[10px] xl:text-xs font-bold uppercase border border-gray-800 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
                      >
                        Éditer
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Supprimer "${c.name}" ?`))
                            deleteMutation.mutate(c.id);
                        }}
                        className="py-2 text-[10px] xl:text-xs font-bold uppercase bg-red-900/10 border border-red-900/30 text-red-600 hover:bg-red-600 hover:text-black transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {(open || editing || shareOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            onClick={() => {
              setOpen(false);
              setEditing(null);
              setShareOpen(false);
            }}
          />

          <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
            <div className="h-1 w-full bg-[#39ff14] shadow-[0_0_10px_#39ff14]" />
            <button
              onClick={() => {
                setOpen(false);
                setEditing(null);
                setShareOpen(false);
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white font-mono font-bold"
            >
              [ESC]
            </button>

            <div className="p-6 md:p-8">
              {open && (
                <>
                  <h2 className="text-2xl font-black text-white uppercase italic mb-6">
                    Nouvelle <span className="text-[#39ff14]">Recrue</span>
                  </h2>
                  <AddCanForm
                    groupId={groupId}
                    onCreated={() => setOpen(false)}
                  />
                </>
              )}

              {editing && (
                <>
                  <h2 className="text-2xl font-black text-white uppercase italic mb-6">
                    Mise à jour <span className="text-blue-500">Data</span>
                  </h2>
                  <EditCanForm
                    can={editing}
                    groupId={groupId}
                    onClose={() => setEditing(null)}
                  />
                </>
              )}

              {shareOpen && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-black text-white uppercase mb-2">
                      Accès Restreint
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Code d'accès unique pour inviter un membre.
                    </p>
                  </div>

                  {inviteCode ? (
                    <div className="bg-black border border-dashed border-gray-700 p-4 flex flex-col sm:flex-row items-center gap-4">
                      <code className="w-full sm:flex-1 text-[#39ff14] font-mono text-lg tracking-widest text-center break-all">
                        {inviteCode}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(inviteCode);
                          alert("COPIED");
                        }}
                        className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold px-4 py-3 uppercase"
                      >
                        Copier
                      </button>
                    </div>
                  ) : (
                    <p className="text-red-500 text-sm font-mono">
                      ERREUR: CODE NON GÉNÉRÉ
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
