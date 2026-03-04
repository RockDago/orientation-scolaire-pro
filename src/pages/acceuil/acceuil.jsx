import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Section1  from "./contenu/section 1";
import Section2  from "./contenu/section 2";
import Section3  from "./contenu/section 3";
import Section4  from "./contenu/section 4";
import Section5  from "./contenu/section 5";
import Section6  from "./contenu/section 6";
import Section7  from "./contenu/section 7";
import Section8  from "./contenu/section 8";
import Section9  from "./contenu/section 9";
import Section10 from "./contenu/section 10";
import Section11 from "./contenu/section 11";

export default function Acceuil() {
  const navigate = useNavigate();
  const location = useLocation();

  const [metierSelectionne,            setMetierSelectionne]            = useState(null);
  const [regionSelectionnee,           setRegionSelectionnee]           = useState(null);
  const [reponseStatut,                setReponseStatut]                = useState(null);
  const [reponseDomaine,               setReponseDomaine]               = useState(null);
  const [reponseEtudes,                setReponseEtudes]                = useState(null);
  const [metierOrientationSelectionne, setMetierOrientationSelectionne] = useState(null);

  const [sourceFlux, setSourceFlux] = useState("metier");
  const [animDir, setAnimDir] = useState("forward");

  const naviguerVers = (path, direction = "forward") => {
    setAnimDir(direction);
    navigate(path);
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimDir("forward"), 300);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <>
      <style>{`
        @keyframes slideInRight { from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }
        .anim-forward { animation: slideInRight 0.28s cubic-bezier(0.22,1,0.36,1) both; }
        .anim-back    { animation: slideInLeft  0.28s cubic-bezier(0.22,1,0.36,1) both; }
      `}</style>

      <div className="min-h-screen w-full bg-white">
        <div className="w-full h-full">
          <div key={location.pathname} className={animDir === "forward" ? "anim-forward" : "anim-back"}>
            <Routes>

              {/* ── S1 : Accueil ── */}
              <Route path="/orientation" element={
                <Section1
                  onChoisirMetier={() => {
                    setSourceFlux("metier");
                    naviguerVers("/acceuil/trouver-metier", "forward");
                  }}
                  onOrientation={() => {
                    setSourceFlux("orientation");
                    naviguerVers("/acceuil/trouver-mon-orientation", "forward");
                  }}
                />
              } />

              {/* ── S2 : Choisir un métier ── */}
              <Route path="/trouver-metier" element={
                <Section2
                  selectedMetier={metierSelectionne}
                  onSelectMetier={(metier) => {
                    setMetierSelectionne(metier);
                    naviguerVers("/acceuil/metier", "forward");
                  }}
                  onRetour={() => naviguerVers("/acceuil/orientation", "back")}
                />
              } />

              {/* ── S3 : Détail métier + parcours ── */}
              <Route path="/metier" element={
                <Section3
                  metier={metierSelectionne}
                  onRetour={() => naviguerVers("/acceuil/trouver-metier", "back")}
                  onVoirCarte={() => naviguerVers("/acceuil/region-map-madagascar", "forward")}
                />
              } />

              {/* ── S5 : Carte des régions ── */}
              <Route path="/region-map-madagascar" element={
                <Section5
                  metier={metierSelectionne}
                  onRetour={() => {
                    if (sourceFlux === "orientation") {
                      naviguerVers("/acceuil/parcours-formation", "back");
                    } else {
                      naviguerVers("/acceuil/metier", "back");
                    }
                  }}
                  onSelectRegion={(regionId) => {
                    setRegionSelectionnee(regionId);
                    naviguerVers("/acceuil/universiter-parcours", "forward");
                  }}
                />
              } />

              {/* ── S4 : Liste établissements ── */}
              <Route path="/universiter-parcours" element={
                <Section4
                  metier={metierSelectionne}
                  selectedRegion={regionSelectionnee}
                  onRetour={() => naviguerVers("/acceuil/region-map-madagascar", "back")}
                />
              } />

              {/* ── S6 : Orientation intro ── */}
              <Route path="/trouver-mon-orientation" element={
                <Section6
                  onRetour={() => naviguerVers("/acceuil/orientation", "back")}
                  onCommencer={() => naviguerVers("/acceuil/recommendation", "forward")}
                />
              } />

              {/* ── S7 : Tu es actuellement ── */}
              <Route path="/recommendation" element={
                <Section7
                  onRetour={() => naviguerVers("/acceuil/trouver-mon-orientation", "back")}
                  onSuivant={(statut) => {
                    setReponseStatut(statut);
                    naviguerVers("/acceuil/trouver-domaine", "forward");
                  }}
                />
              } />

              {/* ── S8 : Quel domaine t'attire ? ── */}
              <Route path="/trouver-domaine" element={
                <Section8
                  onRetour={() => naviguerVers("/acceuil/recommendation", "back")}
                  onSuivant={(domaine) => {
                    setReponseDomaine(domaine);
                    naviguerVers("/acceuil/type-etude", "forward");
                  }}
                />
              } />

              {/* ── S9 : Type d'études ── */}
              <Route path="/type-etude" element={
                <Section9
                  onRetour={() => naviguerVers("/acceuil/trouver-domaine", "back")}
                  onVoirResultats={(choixEtudes) => {
                    setReponseEtudes(choixEtudes);
                    naviguerVers("/acceuil/metier-suggerer", "forward");
                  }}
                />
              } />

              {/* ── S10 : Métiers suggérés ── */}
              <Route path="/metier-suggerer" element={
                <Section10
                  reponseStatut={reponseStatut}
                  reponseDomaine={reponseDomaine}
                  reponseEtudes={reponseEtudes}
                  onRetour={() => naviguerVers("/acceuil/type-etude", "back")}
                  onVoirParcours={(metier) => {
                    setMetierOrientationSelectionne(metier);
                    naviguerVers("/acceuil/parcours-formation", "forward");
                  }}
                />
              } />

              {/* ── S11 : Parcours de formation ── */}
              <Route path="/parcours-formation" element={
                <Section11
                  metier={metierOrientationSelectionne}
                  onRetour={() => naviguerVers("/acceuil/metier-suggerer", "back")}
                  onVoirFormations={(metier) => {
                    setMetierSelectionne(metier);
                    setSourceFlux("orientation");
                    naviguerVers("/acceuil/region-map-madagascar", "forward");
                  }}
                />
              } />

              <Route path="/" element={<Navigate to="/acceuil/orientation" replace />} />
              <Route path="*" element={<Navigate to="/acceuil/orientation" replace />} />

            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
