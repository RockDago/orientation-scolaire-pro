import logo from "../../../assets/logo.jpeg";
import { GiGraduateCap } from "react-icons/gi";
import { BsPencilSquare } from "react-icons/bs";
import { useState } from "react";

export default function Section1({ onChoisirMetier, onOrientation }) {
  const [transitioning, setTransitioning] = useState(null); 

  const handleChoisirMetier = () => {
    setTransitioning("metier");
    setTimeout(() => {
      onChoisirMetier?.();
    }, 750);
  };

  const handleOrientation = () => {
    setTransitioning("orientation");
    setTimeout(() => {
      onOrientation?.();
    }, 750);
  };

  return (
    <>
      {transitioning && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ pointerEvents: "all" }}
        >
          <div
            className="absolute inset-y-0 left-0 w-1/2 transition-animation"
            style={{
              background:
                transitioning === "metier"
                  ? "linear-gradient(135deg, #1565C0, #0D47A1)"
                  : "linear-gradient(135deg, #75B82A, #5E9422)",
              animation: "curtainLeft 0.75s cubic-bezier(0.86,0,0.07,1) forwards",
            }}
          />
          <div
            className="absolute inset-y-0 right-0 w-1/2 transition-animation"
            style={{
              background:
                transitioning === "metier"
                  ? "linear-gradient(135deg, #0D47A1, #1565C0)"
                  : "linear-gradient(135deg, #5E9422, #75B82A)",
              animation: "curtainRight 0.75s cubic-bezier(0.86,0,0.07,1) forwards",
            }}
          />
          <div
            className="relative z-10"
            style={{
              animation: "logoReveal 0.75s cubic-bezier(0.16,1,0.3,1) 0.2s both",
            }}
          >
            <img
              src={logo}
              alt="MESUPRES"
              className="h-20 w-auto object-contain drop-shadow-2xl"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>
      )}

      <section
        className="relative w-full min-h-screen bg-white flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8"
        style={{
          animation: "sectionEntrance 0.6s cubic-bezier(0.16,1,0.3,1) both",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "120px",
          }}
        />

        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-5"
          style={{
            background: "radial-gradient(circle at top right, #1565C0, transparent 70%)",
          }}
        />

        <div className="relative flex-1 flex flex-col items-center justify-center">
          <div
            className="flex flex-col items-center justify-center w-full py-4 md:py-6 gap-3"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
          >
            <img
              src={logo}
              alt="MESUPRES Logo"
              className="w-auto object-contain drop-shadow-sm
                h-[clamp(5rem,10vw,8rem)] lg:h-20 xl:h-24 2xl:h-28"
            />
            <span className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 
              text-[clamp(0.75rem,1.5vw,1rem)] lg:text-xs xl:text-sm font-semibold 
              px-4 lg:px-3 py-1.5 lg:py-1 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              Orientation scolaire &amp; professionnelle
            </span>
          </div>

          <div
            className="w-full max-w-5xl lg:max-w-3xl xl:max-w-4xl mx-auto text-center mt-2 lg:mt-4 xl:mt-6 mb-6 lg:mb-8 xl:mb-10"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
          >
            <h1 className="font-extrabold text-slate-900 leading-tight tracking-tight
              text-[clamp(1.75rem,6vw,4.5rem)] lg:text-2xl xl:text-3xl 2xl:text-4xl">
              Que veux-tu faire
              <br />
              aujourd&apos;hui ?
            </h1>
            <p className="text-slate-500 leading-relaxed max-w-2xl lg:max-w-xl mx-auto mt-4 lg:mt-3
              text-[clamp(0.85rem,2vw,1.5rem)] lg:text-xs xl:text-sm">
              Découvre les métiers et les formations qui te correspondent
            </p>
          </div>

          <div
            className="w-full max-w-6xl lg:max-w-4xl xl:max-w-5xl mx-auto flex flex-col lg:flex-row gap-[clamp(1rem,4vw,3rem)] lg:gap-4 xl:gap-5 flex-1 lg:flex-none pb-4 lg:pb-0"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
          >
            <button
              type="button"
              onClick={handleChoisirMetier}
              className="
                flex-1 text-left cursor-pointer border-none
                bg-gradient-to-br from-[#1565C0] to-[#0D47A1]
                shadow-sm hover:shadow-2xl lg:hover:shadow-md hover:-translate-y-1.5 lg:hover:-translate-y-0.5
                active:translate-y-0 transition-all duration-300 lg:duration-200
                flex flex-col justify-center overflow-hidden relative
                focus:outline-none focus-visible:ring-4 lg:focus-visible:ring-2 focus-visible:ring-blue-300 lg:focus-visible:ring-blue-200
                group
                rounded-[clamp(1rem,3vw,2rem)] lg:rounded-xl
                p-[clamp(1.5rem,4vw,4rem)] lg:p-4 xl:p-5
              "
              style={{
                boxShadow: "0 4px 30px rgba(13,71,161,0.15)",
              }}
            >
              <div className="flex items-center justify-between gap-[clamp(1rem,3vw,4rem)] lg:gap-4 w-full">
                <div className="flex-1 z-10">
                  <h2 className="font-extrabold text-white leading-tight lg:leading-snug
                    text-[clamp(1.5rem,3.5vw,3.5rem)] lg:text-lg xl:text-xl 2xl:text-2xl">
                    Explorer
                    <br />
                    les métiers
                  </h2>
                  <p className="text-white/80 font-medium
                    mt-[clamp(0.5rem,1.5vw,1.5rem)] lg:mt-2
                    text-[clamp(0.85rem,2vw,1.5rem)] lg:text-xs xl:text-sm">
                    Je sais déjà ce qui m&apos;intéresse
                  </p>
                </div>
                <GiGraduateCap
                  className="text-white/90 shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 z-10
                    w-[clamp(4rem,15vw,12rem)] lg:w-10 xl:w-12
                    h-[clamp(4rem,15vw,12rem)] lg:h-10 xl:h-12"
                />
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-0 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                  }}
                />
              </div>
            </button>

            <button
              type="button"
              onClick={handleOrientation}
              className="
                flex-1 text-left cursor-pointer border-none
                bg-gradient-to-br from-[#75B82A] to-[#5E9422]
                shadow-sm hover:shadow-2xl lg:hover:shadow-md hover:-translate-y-1.5 lg:hover:-translate-y-0.5
                active:translate-y-0 transition-all duration-300 lg:duration-200
                flex flex-col justify-center overflow-hidden relative
                focus:outline-none focus-visible:ring-4 lg:focus-visible:ring-2 focus-visible:ring-green-300 lg:focus-visible:ring-green-200
                group
                rounded-[clamp(1rem,3vw,2rem)] lg:rounded-xl
                p-[clamp(1.5rem,4vw,4rem)] lg:p-4 xl:p-5
              "
              style={{
                boxShadow: "0 4px 30px rgba(94,148,34,0.15)",
              }}
            >
              <div className="flex items-center justify-between gap-[clamp(1rem,3vw,4rem)] lg:gap-4 w-full">
                <div className="flex-1 z-10">
                  <h2 className="font-extrabold text-white leading-tight lg:leading-snug
                    text-[clamp(1.5rem,3.5vw,3.5rem)] lg:text-lg xl:text-xl 2xl:text-2xl">
                    Trouver
                    <br />
                    mon orientation
                  </h2>
                  <p className="text-white/80 font-medium
                    mt-[clamp(0.5rem,1.5vw,1.5rem)] lg:mt-2
                    text-[clamp(0.85rem,2vw,1.5rem)] lg:text-xs xl:text-sm">
                    Je ne sais pas encore
                  </p>
                </div>
                <BsPencilSquare
                  className="text-white/90 shrink-0 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 z-10
                    w-[clamp(4rem,15vw,12rem)] lg:w-10 xl:w-12
                    h-[clamp(4rem,15vw,12rem)] lg:h-10 xl:h-12"
                />
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 lg:opacity-0 lg:group-hover:opacity-0 transition-opacity duration-500"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
                  }}
                />
              </div>
            </button>
          </div>
        </div>

        <p
          className="mt-8 lg:mt-6 text-center text-slate-400
            text-[clamp(0.75rem,1.5vw,1rem)] lg:text-xs"
          style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
        >
          &copy; {new Date().getFullYear()} MESUPRES — Tous droits réservés
        </p>

        <style>{`
          @keyframes sectionEntrance {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(24px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes curtainLeft {
            from { transform: translateX(-100%); }
            to   { transform: translateX(0); }
          }
          @keyframes curtainRight {
            from { transform: translateX(100%); }
            to   { transform: translateX(0); }
          }
          @keyframes logoReveal {
            from { opacity: 0; transform: scale(0.7); }
            to   { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </section>
    </>
  );
}