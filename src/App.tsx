import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { countCansForGroup } from "./api/cans";
import { getMyGroupId } from "./lib/ensureGroup";

import Logout from "./auth/Logout";
import { StatsSection } from "./components/StatsWidget";

export default function App() {
  const groupIdQ = useQuery({
    queryKey: ["home-group-id"],
    queryFn: getMyGroupId,
  });

  const cansCountQ = useQuery({
    queryKey: ["home-cans-count", groupIdQ.data],
    queryFn: () => countCansForGroup(groupIdQ.data!),
    enabled: !!groupIdQ.data,
  });

  const cansCount = cansCountQ.data ?? 0;

  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-[#39ff14] selection:text-black flex flex-col">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        ></div>

        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-green-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[150px]" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden opacity-[0.03] rotate-[-5deg]">
          <div className="whitespace-nowrap text-[15vw] font-black italic uppercase leading-none text-white animate-marquee">
            UNLEASH THE BEAST // COLLECT // DRINK // REPEAT // UNLEASH THE BEAST
            //
          </div>
        </div>
      </div>

      <nav className="relative z-50 flex justify-between items-center px-6 py-6 md:px-12 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#39ff14] skew-x-[-10deg] shadow-[0_0_10px_#39ff14]" />
          <span className="font-black text-xl tracking-tighter italic">
            CAN<span className="text-[#39ff14]">VAULT</span>
          </span>
        </div>

        <div className="opacity-70 hover:opacity-100 transition-opacity">
          <Logout />
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center w-full px-4 flex-grow">
        <div className="min-h-[70vh] flex flex-col justify-center items-center text-center w-full mb-20">
          <div className="mb-12 relative group cursor-default">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 group-hover:to-[#39ff14] transition-all duration-500">
              YOUR <br />
              <span className="text-stroke-white text-transparent">
                OBSESSION
              </span>
            </h1>
            <div className="h-2 w-full bg-[#39ff14] mt-4 skew-x-[-20deg] shadow-[0_0_20px_#39ff14] origin-left scale-x-50 group-hover:scale-x-100 transition-transform duration-500" />
          </div>

          <p className="max-w-xl text-gray-400 text-sm md:text-lg font-medium uppercase tracking-widest mb-12">
            La plateforme ultime pour gérer, cataloguer et partager votre
            collection de Monster Energy.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            <Link to="/appHome" className="group relative block">
              <div className="absolute inset-0 bg-[#39ff14] skew-x-[-10deg] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
              <div className="relative bg-[#0a0a0a] border border-gray-700 group-hover:border-[#39ff14] p-8 skew-x-[-10deg] transition-all duration-300 group-hover:-translate-y-2 overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-12 h-12 text-[#39ff14]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-[#39ff14] skew-x-[10deg]">
                  Accéder au Vault
                </h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-2 skew-x-[10deg]">
                  Gérer ma collection
                </p>
              </div>
            </Link>

            <Link to="/join-group" className="group relative block">
              <div className="absolute inset-0 bg-blue-500 skew-x-[-10deg] blur-md opacity-10 group-hover:opacity-40 transition-opacity duration-300"></div>
              <div className="relative bg-[#0a0a0a] border border-gray-700 group-hover:border-blue-500 p-8 skew-x-[-10deg] transition-all duration-300 group-hover:-translate-y-2 overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-12 h-12 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-black uppercase italic text-white group-hover:text-blue-400 skew-x-[10deg]">
                  Rejoindre
                </h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-2 skew-x-[10deg]">
                  Entrer un code d'invitation
                </p>
              </div>
            </Link>
          </div>

          <div className="absolute bottom-10 animate-bounce md:hidden opacity-50">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>

        <div className="w-full max-w-5xl mb-20 relative">
          <div className="flex items-center gap-4 mb-8 opacity-80">
            <div className="h-[1px] bg-gradient-to-r from-transparent to-[#39ff14] w-full"></div>
            <h2 className="whitespace-nowrap font-mono text-[#39ff14] text-sm tracking-[0.3em] uppercase">
              System Metrics // Live Data
            </h2>
            <div className="h-[1px] bg-gradient-to-l from-transparent to-[#39ff14] w-full"></div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#39ff14] to-blue-600 opacity-20 blur group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-xl overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                  backgroundSize: "40px 40px",
                }}
              ></div>

              <div className="relative z-10">
                <StatsSection cansCount={cansCount} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full p-6 flex flex-col md:flex-row gap-4 justify-between items-center md:items-end text-[10px] text-gray-600 font-mono uppercase tracking-widest border-t border-white/5 bg-black/80 backdrop-blur-md mt-auto">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span>
            System Status:{" "}
            <span className="text-[#39ff14] animate-pulse">ONLINE</span>
          </span>
          <span>Version: 2.0.0-ALPHA // SECURE CONNECTION</span>
        </div>
        <div className="text-center md:text-right">
          <p>Built with React + Vite</p>
          <p className="hover:text-white transition-colors cursor-pointer">
            © 2024 Monster Collection
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .text-stroke-white {
            -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
      `}</style>
    </div>
  );
}
