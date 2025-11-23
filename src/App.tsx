import { Link } from "react-router-dom";
import Logout from "./auth/Logout";

export default function App() {
  return (
    <div className="relative min-h-screen w-full bg-[#050505] text-white overflow-hidden font-sans selection:bg-[#39ff14] selection:text-black">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-green-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden opacity-[0.03] pointer-events-none rotate-[-5deg] select-none">
        <div className="whitespace-nowrap text-[15vw] font-black italic uppercase leading-none text-white animate-marquee">
          UNLEASH THE BEAST // COLLECT // DRINK // REPEAT // UNLEASH THE BEAST
          //
        </div>
      </div>

      <nav className="relative z-50 flex justify-between items-center px-6 py-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#39ff14] skew-x-[-10deg]" />
          <span className="font-black text-xl tracking-tighter italic">
            CAN<span className="text-[#39ff14]">VAULT</span>
          </span>
        </div>

        <div className="opacity-70 hover:opacity-100 transition-opacity">
          <Logout />
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
        <div className="mb-12 relative group">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 group-hover:to-[#39ff14] transition-all duration-500">
            YOUR <br />
            <span className="text-stroke-white text-transparent">
              OBSESSION
            </span>
          </h1>
          <div className="h-2 w-full bg-[#39ff14] mt-4 skew-x-[-20deg] shadow-[0_0_20px_#39ff14]" />
        </div>

        <p className="max-w-xl text-gray-400 text-sm md:text-lg font-medium uppercase tracking-widest mb-12">
          La plateforme ultime pour gérer, cataloguer et partager votre
          collection de Monster Energy.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <Link to="/appHome" className="group relative block">
            <div className="absolute inset-0 bg-[#39ff14] skew-x-[-10deg] blur-md opacity-20 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="relative bg-[#0a0a0a] border border-gray-700 group-hover:border-[#39ff14] p-8 skew-x-[-10deg] transition-all duration-300 group-hover:-translate-y-2 overflow-hidden">
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
            <div className="relative bg-[#0a0a0a] border border-gray-700 group-hover:border-blue-500 p-8 skew-x-[-10deg] transition-all duration-300 group-hover:-translate-y-2 overflow-hidden">
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
      </main>

      <footer className="absolute bottom-0 w-full p-6 flex justify-between items-end text-[10px] text-gray-600 font-mono uppercase tracking-widest border-t border-white/5 bg-black/50 backdrop-blur-sm">
        <div className="flex flex-col gap-1">
          <span>
            System Status: <span className="text-[#39ff14]">ONLINE</span>
          </span>
          <span>Version: 2.0.0-ALPHA</span>
        </div>
        <div className="text-right">
          <p>Built with React + Vite</p>
          <p>© 2024 Monster Collection</p>
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
