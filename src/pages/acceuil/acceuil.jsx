import { Routes, Route, useNavigate, useLocation, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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

import {
  trackPageView,
  trackMetierSearch,
} from "../../services/dashboard.services";

import { toSearchSlug } from "../../utils/slug";
import BuildingSVG from "./contenu/BuildingSVG";

const PUBLIC_ROUTE_PATTERNS = [
  /^\/acceuil\/orientation$/,
  /^\/acceuil\/trouver-metier$/,
  /^\/acceuil\/trouver-metier\/[a-z0-9-]+$/,
  /^\/acceuil\/metier\/[a-z0-9-]+$/,
  /^\/acceuil\/region-map-madagascar$/,
  /^\/acceuil\/universiter-parcours$/,
  /^\/acceuil\/trouver-mon-orientation$/,
  /^\/acceuil\/recommendation$/,
  /^\/acceuil\/trouver-domaine$/,
  /^\/acceuil\/type-etude$/,
  /^\/acceuil\/metier-suggerer$/,
  /^\/acceuil\/parcours-formation$/,
];

function Section2Wrapper(props) {
  const { slug } = useParams();
  const searchParam = slug ? decodeURIComponent(slug.replace(/-/g, " ")) : "";
  return <Section2 {...props} searchParam={searchParam} />;
}

function Section3Wrapper({ metierSelectionne, setMetierSelectionne, ...props }) {
  const { slug } = useParams();
  return (
    <Section3
      {...props}
      metier={metierSelectionne}
      slugFromUrl={slug ?? null}
      onMetierLoaded={setMetierSelectionne}
    />
  );
}

export default function Acceuil() {
  const navigate = useNavigate();
  const location = useLocation();

  const [metierSelectionne,            setMetierSelectionne]            = useState(null);
  const [regionSelectionnee,           setRegionSelectionnee]           = useState(null);
  const [reponseStatut,                setReponseStatut]                = useState(null);
  const [reponseDomaine,               setReponseDomaine]               = useState(null);
  const [reponseEtudes,                setReponseEtudes]                = useState(null);
  const [metierOrientationSelectionne, setMetierOrientationSelectionne] = useState(null);
  const [sourceFlux,                   setSourceFlux]                   = useState("metier");
  const [animDir,                      setAnimDir]                      = useState("idle");

  const naviguerVers = (path, direction = "forward") => {
    setAnimDir(direction);
    let finalPath = path;
    
    if (!path.startsWith("/acceuil")) {
      finalPath = `/acceuil${path.startsWith("/") ? "" : "/"}${path}`;
    }

    if (!PUBLIC_ROUTE_PATTERNS.some((pattern) => pattern.test(finalPath))) {
      finalPath = "/acceuil/orientation";
    }

    navigate(finalPath);
  };

  useEffect(() => {
    const t = setTimeout(() => setAnimDir("idle"), 300);
    return () => clearTimeout(t);
  }, [location.pathname]);

  const trackingInFlight = useRef(new Set());

  useEffect(() => {
    const page = location.pathname;
    
    // On ne traque que l'entrée principale de l'orientation
    // (pour éviter de compter chaque étape du questionnaire)
    if (!page.endsWith("/orientation")) return;

    const metierId = metierSelectionne?.id ?? null;
    if (trackingInFlight.current.has(page)) return;
    trackingInFlight.current.add(page);
    trackPageView(page, metierId).finally(() => {
      trackingInFlight.current.delete(page);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const naviguerVersMetier = (metier, direction = "forward") => {
    const slug = toSearchSlug(metier.label);
    naviguerVers(`/acceuil/metier/${slug}`, direction);
  };

  const onHome = () => naviguerVers("/acceuil/orientation", "back");

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-36px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-forward { animation: slideInRight 0.28s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
        .anim-back    { animation: slideInLeft  0.28s cubic-bezier(0.22,1,0.36,1) both; will-change: transform, opacity; }
        .anim-idle    { animation: none; }
      `}</style>

      <div className="w-full min-h-screen bg-white">
        <div className="w-full min-h-screen flex flex-col">
          <div
            key={location.pathname}
            className={
              animDir === "forward" ? "anim-forward" :
              animDir === "back"    ? "anim-back"    :
                                      "anim-idle"
            }
            style={{ flex: 1, display: "flex", flexDirection: "column" }}
          >
            <Routes>

              {/* ── S1 : Accueil ── */}
              <Route
                path="orientation"
                element={
                  <Section1
                    onChoisirMetier={() => {
                      setSourceFlux("metier");
                      naviguerVers("/trouver-metier", "forward");
                    }}
                    onOrientation={() => {
                      setSourceFlux("orientation");
                      naviguerVers("/trouver-mon-orientation", "forward");
                    }}
                  />
                }
              />

              {/* ── S2 : Choisir un métier ── */}
              <Route
                path="trouver-metier"
                element={
                  <Section2Wrapper
                    selectedMetier={metierSelectionne}
                    onSelectMetier={(metier) => {
                      trackMetierSearch(metier.id, metier.label);
                      setMetierSelectionne(metier);
                      setReponseDomaine(null);
                      naviguerVersMetier(metier, "forward");
                    }}
                    onRetour={() => {
                      setMetierSelectionne(null);
                      naviguerVers("/orientation", "back");
                    }}
                    onHome={onHome}
                  />
                }
              />
              <Route
                path="trouver-metier/:slug"
                element={
                  <Section2Wrapper
                    selectedMetier={metierSelectionne}
                    onSelectMetier={(metier) => {
                      trackMetierSearch(metier.id, metier.label);
                      setMetierSelectionne(metier);
                      setReponseDomaine(null);
                      naviguerVersMetier(metier, "forward");
                    }}
                    onRetour={() => {
                      setMetierSelectionne(null);
                      naviguerVers("/orientation", "back");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S3 : Détail métier ── */}
              {/* Résistant au refresh : Section3 recharge depuis BDD via slugFromUrl */}
              <Route
                path="metier/:slug"
                element={
                  <Section3Wrapper
                    metierSelectionne={metierSelectionne}
                    setMetierSelectionne={setMetierSelectionne}
                    onRetour={() => {
                      setMetierSelectionne(null);
                      naviguerVers("/trouver-metier", "back");
                    }}
                    onVoirCarte={(metier) => {
                      if (metier) setMetierSelectionne(metier);
                      naviguerVers("/region-map-madagascar", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S5 : Carte des régions ── */}
              <Route
                path="region-map-madagascar"
                element={
                  <Section5
                    metier={metierSelectionne}
                    reponseDomaine={reponseDomaine}
                    onRetour={() => {
                      if (sourceFlux === "orientation") {
                        naviguerVers("/parcours-formation", "back");
                      } else {
                        const slug = metierSelectionne
                          ? toSearchSlug(metierSelectionne.label)
                          : null;
                        naviguerVers(
                          slug ? `/metier/${slug}` : "/trouver-metier",
                          "back"
                        );
                      }
                    }}
                    onSelectRegion={(regionId) => {
                      setRegionSelectionnee(regionId);
                      naviguerVers("/universiter-parcours", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S4 : Liste établissements ── */}
              <Route
                path="universiter-parcours"
                element={
                  <Section4
                    metier={metierSelectionne}
                    selectedRegion={regionSelectionnee}
                    reponseDomaine={reponseDomaine}
                    onRetour={() => naviguerVers("/region-map-madagascar", "back")}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S6 : Orientation intro ── */}
              <Route
                path="trouver-mon-orientation"
                element={
                  <Section6
                    onRetour={() => naviguerVers("/orientation", "back")}
                    onCommencer={() => naviguerVers("/recommendation", "forward")}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S7 : Tu es actuellement ── */}
              <Route
                path="recommendation"
                element={
                  <Section7
                    onRetour={() => naviguerVers("/trouver-mon-orientation", "back")}
                    onSuivant={(statut) => {
                      setReponseStatut(statut);
                      naviguerVers("/trouver-domaine", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S8 : Quel domaine/mention ── */}
              <Route
                path="trouver-domaine"
                element={
                  <Section8
                    onRetour={() => naviguerVers("/recommendation", "back")}
                    onSuivant={(domaine) => {
                      setReponseDomaine(domaine);
                      naviguerVers("/type-etude", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S9 : Type d'études ── */}
              <Route
                path="type-etude"
                element={
                  <Section9
                    reponseDomaine={reponseDomaine}
                    onRetour={() => naviguerVers("/trouver-domaine", "back")}
                    onVoirResultats={(choixEtudes) => {
                      setReponseEtudes(choixEtudes);
                      naviguerVers("/metier-suggerer", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S10 : Métiers suggérés ── */}
              <Route
                path="metier-suggerer"
                element={
                  <Section10
                    reponseStatut={reponseStatut}
                    reponseDomaine={reponseDomaine}
                    reponseEtudes={reponseEtudes}
                    onRetour={() => naviguerVers("/type-etude", "back")}
                    onVoirParcours={(metier) => {
                      setMetierOrientationSelectionne(metier);
                      naviguerVers("/parcours-formation", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── S11 : Parcours de formation ── */}
              <Route
                path="parcours-formation"
                element={
                  <Section11
                    metier={metierOrientationSelectionne}
                    onRetour={() => naviguerVers("/metier-suggerer", "back")}
                    onVoirFormations={(metier) => {
                      setMetierSelectionne(metier);
                      setSourceFlux("orientation");
                      naviguerVers("/region-map-madagascar", "forward");
                    }}
                    onHome={onHome}
                  />
                }
              />

              {/* ── Redirections ── */}
              <Route path="/"  element={<Navigate to="/acceuil/orientation" replace />} />
              <Route path="*"  element={<Navigate to="/acceuil/orientation" replace />} />

            </Routes>
          </div>
        </div>
      </div>
    </>
  );
}
