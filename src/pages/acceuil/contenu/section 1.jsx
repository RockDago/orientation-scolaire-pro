import logo from "../../../assets/logo.jpeg";
import { GiGraduateCap } from "react-icons/gi";
import { BsPencilSquare } from "react-icons/bs";

export default function Section1({ onChoisirMetier, onOrientation }) {
  return (
    <section className="relative w-full min-h-screen bg-white flex flex-col px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 md:py-8">
      {/* Contenu principal */}
      <div className="flex-1 flex flex-col">
        {/* Logo + badge */}
        <div className="flex flex-col items-center justify-center w-full py-4 md:py-6 gap-3">
          <img
            src={logo}
            alt="MESUPRES Logo"
            className="h-20 md:h-24 lg:h-28 xl:h-32 w-auto object-contain"
          />
          <span className="inline-flex items-center gap-2 bg-white border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
            Orientation scolaire &amp; professionnelle
          </span>
        </div>

        {/* Titre + texte - réduction de la taille sur desktop */}
        <div className="w-full max-w-3xl mx-auto text-center md:text-left mt-2 md:mt-4 mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Trouve le métier<br />qui te correspond
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed max-w-xl mx-auto md:mx-0 mt-3">
            Cette application aide les élèves et les parents à choisir un métier
            et le parcours d&apos;études adapté
          </p>
        </div>

        {/* Cards - réduction de la taille sur desktop */}
        <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-4 md:gap-5">
          {/* Card 1 */}
          <button
            type="button"
            onClick={onChoisirMetier}
            className="
              flex-1 rounded-xl p-4 md:p-5 text-left cursor-pointer border-none
              bg-gradient-to-br from-[#1565C0] to-[#0D47A1]
              shadow-sm hover:shadow-md hover:-translate-y-0.5
              active:translate-y-0 transition-all duration-200
              flex flex-col
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold text-white leading-snug">
                  Explorer<br />les métiers
                </h2>
                <p className="mt-2 text-xs md:text-sm text-white/80 font-medium">
                  Je sais déjà ce qui m&apos;intéresse
                </p>
              </div>
              <GiGraduateCap
                size={40}
                className="text-white/90 shrink-0"
              />
            </div>
          </button>

          {/* Card 2 */}
          <button
            type="button"
            onClick={onOrientation}
            className="
              flex-1 rounded-xl p-4 md:p-5 text-left cursor-pointer border-none
              bg-gradient-to-br from-[#75B82A] to-[#5E9422]
              shadow-sm hover:shadow-md hover:-translate-y-0.5
              active:translate-y-0 transition-all duration-200
              flex flex-col
              focus:outline-none focus-visible:ring-2 focus-visible:ring-green-200
            "
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg md:text-xl lg:text-2xl font-extrabold text-white leading-snug">
                  Trouver<br />mon orientation
                </h2>
                <p className="mt-2 text-xs md:text-sm text-white/80 font-medium">
                  Je ne sais pas encore
                </p>
              </div>
              <BsPencilSquare
                size={40}
                className="text-white/90 shrink-0"
              />
            </div>
          </button>
        </div>
      </div>

      {/* Footer au tout bas */}
      <p className="mt-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} MESUPRES — Tous droits réservés
      </p>
    </section>
  );
}