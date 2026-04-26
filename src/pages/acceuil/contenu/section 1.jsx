import logo from "../../../assets/logo.jpeg";
import pictoExplorer from "../../../assets/picto_Explorer.png";
import pictoOrientation from "../../../assets/BIG_picto_Orientation.png";
import { useState } from "react";
import BuildingSVG from "./BuildingSVG";


export default function Section1({ onChoisirMetier, onOrientation }) {
  const [transitioning, setTransitioning] = useState(null);

  const handleChoisirMetier = () => {
    setTransitioning("metier");
    setTimeout(() => { onChoisirMetier?.(); }, 750);
  };

  const handleOrientation = () => {
    setTransitioning("orientation");
    setTimeout(() => { onOrientation?.(); }, 750);
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
            style={{ animation: "logoReveal 0.75s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
          >
            <img
              src={logo}
              alt="MESUPRES"
              className="h-16 w-auto object-contain drop-shadow-2xl"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </div>
        </div>
      )}

      <section
        className="s1-container relative w-full min-h-[100dvh] bg-white flex flex-col pt-10 md:pt-12 pb-6"
        style={{ animation: "sectionEntrance 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Noise texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
            backgroundSize: "120px",
          }}
        />

        {/* Radial glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-5"
          style={{ background: "radial-gradient(circle at top right, #1565C0, transparent 70%)" }}
        />

        {/* Building BG */}
        <div className="fixed bottom-0 left-0 right-0 pointer-events-none z-0 opacity-[0.8]">
          <BuildingSVG />
        </div>

        <div className="relative flex-1 flex flex-col items-center justify-center">

          {/* Logo + Badge */}
          <div
            className="flex flex-col items-center justify-center w-full py-8 md:py-10 gap-4"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both" }}
          >
            <img src={logo} alt="MESUPRES Logo" className="s1-logo w-auto object-contain drop-shadow-sm" />
            <span className="s1-badge inline-flex items-center gap-1.5 bg-white border border-blue-100 text-blue-700 font-semibold px-4 py-1.5 rounded-full shadow-sm">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
              Orientation scolaire &amp; professionnelle
            </span>
          </div>

          {/* Titre */}
          <div
            className="s1-header-text w-full max-w-6xl mx-auto text-center mt-8 mb-12 md:mt-10 md:mb-16"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}
          >
            <h1 className="s1-title-main font-extrabold text-slate-900 leading-tight tracking-tight">
              Que veux-tu faire
              <br />
              aujourd&apos;hui ?
            </h1>
            <p className="s1-description text-slate-500 leading-relaxed max-w-3xl mx-auto mt-4">
              Découvre les métiers et les formations qui te correspondent
            </p>
          </div>

          {/* Cards */}
          <div
            className="s1-cards-container w-full lg:max-w-3xl xl:max-w-4xl mx-auto flex flex-col lg:flex-row lg:flex-1 lg:flex-none pb-8 lg:pb-0 justify-center"
            style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.35s both" }}
          >
            {/* Card Explorer */}
            <button
              type="button"
              onClick={handleChoisirMetier}
              className="
                s1-card lg:flex-1 text-left cursor-pointer border-none
                bg-gradient-to-br from-[#1565C0] to-[#0D47A1]
                shadow-sm hover:shadow-2xl hover:-translate-y-2
                active:translate-y-0 transition-all duration-300
                flex flex-col justify-center overflow-hidden relative
                focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300
                group
              "
              style={{ boxShadow: "0 8px 40px rgba(13,71,161,0.2)" }}
            >
              <div className="s1-card-inner flex items-center justify-between w-full h-full relative">
                <div className="flex-1 z-10 relative s1-card-content">
                  <h2 className="s1-card-title font-extrabold text-white leading-tight">
                    Explorer<br />les métiers
                  </h2>
                  <p className="s1-card-desc text-white/80 font-medium">
                    Je sais déjà ce qui m&apos;intéresse
                  </p>
                </div>
                <img
                  src={pictoExplorer}
                  alt="Explorer"
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain object-right opacity-90 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-500 z-0 pointer-events-none"
                />
                <div className="absolute -right-10 -top-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 z-0" />
              </div>
            </button>

            {/* Card Orientation */}
            <button
              type="button"
              onClick={handleOrientation}
              className="
                s1-card lg:flex-1 text-left cursor-pointer border-none
                bg-gradient-to-br from-[#75B82A] to-[#5E9422]
                shadow-sm hover:shadow-2xl hover:-translate-y-2
                active:translate-y-0 transition-all duration-300
                flex flex-col justify-center overflow-hidden relative
                focus:outline-none focus-visible:ring-4 focus-visible:ring-green-300
                group
              "
              style={{ boxShadow: "0 8px 40px rgba(117,184,42,0.2)" }}
            >
              <div className="s1-card-inner flex items-center justify-between w-full h-full relative">
                <div className="flex-1 z-10 relative s1-card-content">
                  <h2 className="s1-card-title font-extrabold text-white leading-tight">
                    Trouver<br />mon orientation
                  </h2>
                  <p className="s1-card-desc text-white/80 font-medium">
                    Je ne sais pas encore
                  </p>
                </div>
                <img
                  src={pictoOrientation}
                  alt="Orientation"
                  className="absolute -right-4 top-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain object-right opacity-90 group-hover:scale-105 group-hover:-rotate-3 transition-transform duration-500 z-0 pointer-events-none"
                />
                <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500 z-0" />
              </div>
            </button>
          </div>
        </div>

        <p
          className="s1-footer mt-auto pt-16 pb-4 text-center text-slate-400"
          style={{ animation: "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s both" }}
        >
          &copy; {new Date().getFullYear()} MESUPRES — Tous droits réservés
        </p>

        <style>{`

          /* ─── BASE MOBILE (≥390px) ─── */
          .s1-container { padding: 0.75rem 1rem 0; }
          .s1-logo { height: clamp(6rem, 18vw, 8.5rem); }
          .s1-badge { font-size: 0.7rem; padding: 0.4rem 0.8rem; }
          .s1-title-main { font-size: clamp(1.4rem, 7vw, 2rem); }
          .s1-description { font-size: 0.8rem; }
          .s1-cards-container { gap: 1.25rem; margin-top: 1rem; }
          .s1-card { padding: 0.65rem 1.1rem; border-radius: 1.15rem; }
          .s1-card-title { font-size: 1.25rem; }
          .s1-card-desc { font-size: 0.75rem; margin-top: 0.5rem; }
          .s1-card-content { padding-right: 3.5rem; }
          .s1-footer { font-size: 0.75rem; }


          /* ─── PETIT MOBILE 375×667 ─── */
          @media (max-width: 389px) {
            .s1-container { padding: 0.5rem 0.75rem 0; }

            /* Logo & badge */
            .s1-logo { height: clamp(5.5rem, 20vw, 7rem); }
            .s1-badge { font-size: 0.65rem; padding: 0.35rem 0.7rem; }

            /* Titre & description */
            .s1-header-text { margin-top: 1rem !important; margin-bottom: 1.5rem !important; }
            .s1-title-main { font-size: 1.45rem; }
            .s1-description { font-size: 0.75rem; }

            /* Cards */
            .s1-cards-container { gap: 1rem; margin-top: 1rem; }
            .s1-card { padding: 0.65rem 1rem; border-radius: 1rem; }
            .s1-card-title { font-size: 1.15rem; }
            .s1-card-desc { font-size: 0.7rem; margin-top: 0.4rem; }
            .s1-card-content { padding-right: 3.5rem; }

            /* Footer */
            .s1-footer { margin-top: auto !important; padding-top: 2rem; font-size: 0.65rem; padding-bottom: 0.5rem; }
          }


          /* ─── SM (≥640px) ─── */
          @media (min-width: 640px) {
            .s1-container { padding: 1.5rem 2.5rem 0; }
            .s1-logo { height: 8.5rem; }
            .s1-badge { font-size: 0.85rem; }
            .s1-title-main { font-size: 2.2rem; }
            .s1-description { font-size: 0.95rem; }
            .s1-cards-container { max-width: 450px !important; gap: 1.5rem; }
            .s1-card { padding: 0.85rem 1.15rem; border-radius: 1.25rem; }
            .s1-card-title { font-size: 1.6rem; }
            .s1-card-desc { font-size: 0.9rem; margin-top: 0.6rem; }
            .s1-card-content { padding-right: 5rem; }
          }


          /* ─── MD (≥768px) ─── */
          @media (min-width: 768px) {
            .s1-container { padding-left: 2rem; padding-right: 2rem; }
            .s1-logo { height: 9.5rem; }
            .s1-title-main { font-size: 2.4rem; }
            .s1-description { font-size: 1rem; }
            .s1-cards-container { max-width: 480px !important; gap: 1.75rem; }
            .s1-card { padding: 1.1rem 1.5rem; }
            .s1-card-title { font-size: 1.8rem; }
            .s1-card-desc { font-size: 0.95rem; margin-top: 0.75rem; }
            .s1-card-content { padding-right: 6rem; }
            .s1-footer { font-size: 0.875rem; }
          }


          /* ─── LG (≥1024px) ─── */
          @media (min-width: 1024px) {
            .s1-container { padding-left: 3rem; padding-right: 3rem; padding-top: 0.5rem !important; }
            .s1-logo { height: 6.5rem; }
            .s1-badge { font-size: 0.8rem; }
            .s1-title-main { font-size: 2rem; }
            .s1-description { font-size: 0.9rem; }
            .s1-cards-container { gap: 1.5rem; max-width: 620px !important; margin-top: 1rem; }
            .s1-card { padding: 0.75rem 1.15rem; border-radius: 1.25rem; }
            .s1-card-title { font-size: 1.3rem; }
            .s1-card-desc { font-size: 0.75rem; margin-top: 0.4rem; }
            .s1-card-content { padding-right: 4rem; }
            .s1-header-text { margin-top: 0.5rem !important; margin-bottom: 1rem !important; }
            .s1-footer { margin-top: auto !important; padding-top: 1.5rem; font-size: 0.875rem; }
          }


          /* ─── XL (≥1280px) ─── */
          @media (min-width: 1280px) {
            .s1-container { padding-left: 4rem; padding-right: 4rem; padding-top: 1rem !important; }
            .s1-logo { height: 7.5rem; }
            .s1-badge { font-size: 0.9rem; }
            .s1-title-main { font-size: 2.4rem; }
            .s1-description { font-size: 1rem; }
            .s1-cards-container { gap: 2rem; max-width: 750px !important; margin-top: 1.5rem; }
            .s1-card { padding: 0.85rem 1.25rem; border-radius: 1.75rem; }
            .s1-card-title { font-size: 1.45rem; }
            .s1-card-desc { font-size: 0.85rem; margin-top: 0.6rem; }
            .s1-card-content { padding-right: 5rem; }
            .s1-footer { margin-top: auto !important; padding-top: 2rem; font-size: 0.875rem; }
          }


          /* ─── Animations ─── */
          @media (max-height: 860px) {
            .s1-logo { height: clamp(5.5rem, 12vw, 7rem); }
            .s1-header-text { margin-top: 0.75rem !important; margin-bottom: 1rem !important; }
            .s1-title-main { font-size: clamp(1.6rem, 4vw, 2.2rem); }
            .s1-description { font-size: 0.82rem; }
            .s1-cards-container { gap: 1rem; margin-top: 0.75rem; }
            .s1-card { padding-top: 0.65rem; padding-bottom: 0.65rem; }
            .s1-card-title { font-size: 1.2rem; }
            .s1-card-desc { font-size: 0.74rem; }
            .s1-footer { padding-top: 1rem; }
          }

          @media (max-height: 720px) {
            .s1-container { padding-top: 0.35rem !important; }
            .s1-logo { height: clamp(4.75rem, 10vw, 6rem); }
            .s1-badge { font-size: 0.64rem; padding: 0.3rem 0.65rem; }
            .s1-title-main { font-size: clamp(1.35rem, 3vw, 1.9rem); }
            .s1-description { font-size: 0.74rem; margin-top: 0.5rem; }
            .s1-cards-container { gap: 0.8rem; }
            .s1-card { padding: 0.55rem 0.9rem; }
            .s1-card-title { font-size: 1.05rem; }
            .s1-card-desc { font-size: 0.68rem; margin-top: 0.3rem; }
            .s1-footer { font-size: 0.68rem; padding-top: 0.75rem; }
          }

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
