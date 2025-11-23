import { Link } from "react-router-dom";

export default function Page404() {
  return (
    <div className="fixed inset-0 z-[999] w-screen h-screen flex flex-col items-center justify-center bg-[#050505] text-gray-100 overflow-hidden font-sans selection:bg-[#39ff14] selection:text-black">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      <div
        className="absolute inset-0 pointer-events-none z-10 opacity-10"
        style={{
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))",
          backgroundSize: "100% 2px, 3px 100%",
        }}
      ></div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-green-500/10 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[50vw] h-[50vh] bg-red-500/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div
        className="absolute top-0 left-0 right-0 h-3 bg-yellow-500/80 z-20 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0, #000 10px, #eab308 10px, #eab308 20px)",
        }}
      ></div>
      <div
        className="absolute bottom-0 left-0 right-0 h-3 bg-yellow-500/80 z-20 shadow-[0_0_20px_rgba(234,179,8,0.5)]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #000 0, #000 10px, #eab308 10px, #eab308 20px)",
        }}
      ></div>

      <div className="relative z-30 flex flex-col items-center text-center px-4 w-full max-w-4xl mx-auto">
        <div className="relative mb-8 group cursor-default select-none">
          <h1 className="absolute inset-0 text-[8rem] sm:text-[12rem] md:text-[16rem] leading-none font-black tracking-tighter text-red-500 opacity-70 blur-[2px] translate-x-1 animate-pulse">
            404
          </h1>
          <h1 className="absolute inset-0 text-[8rem] sm:text-[12rem] md:text-[16rem] leading-none font-black tracking-tighter text-blue-500 opacity-70 blur-[2px] -translate-x-1 animate-pulse animation-delay-150">
            404
          </h1>

          <h1 className="relative text-[8rem] sm:text-[12rem] md:text-[16rem] leading-none font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-[#39ff14] to-green-900 drop-shadow-[0_0_30px_rgba(57,255,20,0.5)] italic">
            404
          </h1>

          <div className="absolute top-1/2 left-[-20%] w-[140%] h-[2px] bg-white/20 mix-blend-overlay pointer-events-none"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="absolute inset-0 bg-[#0a0a0a] border border-gray-800 transform skew-x-[-5deg] shadow-[0_0_60px_-15px_rgba(0,0,0,1)]"></div>

          <div className="relative p-8 md:p-10 flex flex-col items-center">
            <div className="mb-6 text-[#39ff14] animate-pulse drop-shadow-[0_0_10px_rgba(57,255,20,0.8)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h2 className="text-3xl md:text-4xl font-black uppercase text-white mb-2 italic tracking-tight">
              SYSTEM{" "}
              <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
                FAILURE
              </span>
            </h2>

            <div className="h-[1px] w-16 bg-gray-600 my-4"></div>

            <p className="text-gray-400 mb-8 text-sm md:text-base font-bold uppercase tracking-wide leading-relaxed max-w-xs mx-auto">
              La canette que vous cherchez a été bue ou n'a jamais existé.
              Protocole de sécurité activé.
            </p>

            <Link
              to="/app"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-black uppercase tracking-widest text-black transition-all duration-200 focus:outline-none"
            >
              <div className="absolute inset-0 bg-[#39ff14] transform skew-x-[-10deg] transition-transform group-hover:skew-x-[-20deg] group-hover:scale-105 shadow-[0_0_20px_rgba(57,255,20,0.4)]"></div>

              <div className="absolute inset-0 bg-white/40 skew-x-[-10deg] translate-x-[-100%] group-hover:animate-[shine_0.5s_ease-in-out] hidden group-hover:block"></div>

              <span className="relative flex items-center gap-2 z-10">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                  />
                </svg>
                Retour Base
              </span>
            </Link>
          </div>

          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#39ff14] -translate-x-1 -translate-y-1"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#39ff14] translate-x-1 translate-y-1"></div>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center text-[10px] text-gray-600 font-mono uppercase tracking-[0.3em] z-30 opacity-50">
        <span>Error_Code: 0xDEAD_BEEF</span>
        <span className="mt-1">Sector: UNKNOWN</span>
      </div>
    </div>
  );
}
