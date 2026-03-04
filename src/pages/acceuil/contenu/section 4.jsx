import { useMemo, useState, useEffect } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import { HiOutlineHome } from "react-icons/hi";
import { FiX, FiMapPin, FiPhone, FiBook, FiAward, FiClock, FiUsers, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

/* ─── DONNÉES ─────────────────────────────────────────────────────────────── */
const ETABLISSEMENTS_PAR_METIER_REGION = {
  "ingenieur-info": {
    analamanga: [
      { nom: "École Supérieure Polytechnique d'Antananarivo (ESPA)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Génie Logiciel / Informatique", niveau: "Licence / Master / Ingénieur" },
      { nom: "Institut Supérieur de Technologie d'Antananarivo (IST)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 401 89", parcours: "Informatique & Télécommunications", niveau: "Licence / Master" },
      { nom: "EMIT — École Malgache d'Ingénieurs et Technologues", type: "Privé", ville: "Antananarivo", region: "Analamanga", contact: "020 22 563 45", parcours: "Informatique générale", niveau: "Licence / Master" },
      { nom: "ITU — Information Technology University", type: "Privé", ville: "Andoharanofotsy, Antananarivo", region: "Analamanga", contact: "034 05 000 00", parcours: "Informatique", niveau: "Licence / Master" },
      { nom: "JAU — Jeanne d'Arc University", type: "Privé", ville: "Ampandrana, Antananarivo", region: "Analamanga", contact: "020 22 651 20", parcours: "Informatique & Sciences de Gestion", niveau: "Licence" },
      { nom: "ISGEI — Institut Supérieur de Génie Électronique Informatique", type: "Privé", ville: "Ampandrana Ouest, Antananarivo", region: "Analamanga", contact: "034 07 000 00", parcours: "Ingénierie Signaux & Systèmes", niveau: "Licence / Master" },
    ],
    "haute-matsiatra": [
      { nom: "Université de Fianarantsoa — Faculté des Sciences", type: "Public", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "020 75 508 02", parcours: "Informatique & Mathématiques", niveau: "Licence / Master" },
      { nom: "ISMT — Institut Supérieur de Management et de Technologie", type: "Privé", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "034 09 000 00", parcours: "Informatique", niveau: "Licence" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Faculté des Sciences", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Informatique", niveau: "Licence / Master" },
    ],
    diana: [
      { nom: "Université d'Antsiranana — IST", type: "Public", ville: "Antsiranana", region: "Diana", contact: "020 82 294 09", parcours: "Informatique & Télécommunications", niveau: "Licence / Master" },
      { nom: "ISPRD — Institut Supérieur Privé de la Région Diana", type: "Privé", ville: "Antsiranana", region: "Diana", contact: "034 06 000 00", parcours: "Gestion & Informatique", niveau: "Licence" },
    ],
    vakinankaratra: [
      { nom: "ASJA — Athénée Saint Joseph Antsirabe", type: "Privé", ville: "Antsirabe", region: "Vakinankaratra", contact: "044 48 319 20", parcours: "Informatique", niveau: "DUT / Licence" },
      { nom: "IESTIME Antsirabe", type: "Privé", ville: "Antsirabe", region: "Vakinankaratra", contact: "034 10 000 00", parcours: "Gestion & Informatique", niveau: "Licence" },
    ],
    boeny: [
      { nom: "Université de Mahajanga — Faculté des Sciences", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Informatique & Mathématiques", niveau: "Licence" },
      { nom: "ISMST — Institut Supérieur de Management Sciences Technologiques", type: "Privé", ville: "Mahajanga", region: "Boeny", contact: "034 11 000 00", parcours: "Gestion & Informatique", niveau: "Licence" },
    ],
  },
  "data-analyst": {
    analamanga: [
      { nom: "École Supérieure Polytechnique d'Antananarivo (ESPA)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Mathématiques & Informatique / Data", niveau: "Licence / Master / Ingénieur" },
      { nom: "Université d'Antananarivo — Département Mathématiques", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Mathématiques & Statistiques", niveau: "Licence / Master" },
      { nom: "IST Antananarivo", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 401 89", parcours: "Statistiques & Analyse de données", niveau: "Licence / Master" },
    ],
    "haute-matsiatra": [
      { nom: "Université de Fianarantsoa — Faculté des Sciences", type: "Public", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "020 75 508 02", parcours: "Mathématiques & Informatique", niveau: "Licence / Master" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Faculté des Sciences", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Mathématiques & Statistiques", niveau: "Licence" },
    ],
    vakinankaratra: [
      { nom: "ASJA — Athénée Saint Joseph Antsirabe", type: "Privé", ville: "Antsirabe", region: "Vakinankaratra", contact: "044 48 319 20", parcours: "Mathématiques & Informatique", niveau: "DUT / Licence" },
    ],
  },
  "medecin": {
    analamanga: [
      { nom: "Faculté de Médecine d'Antananarivo (FMPA)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Médecine générale / Chirurgie / Spécialités", niveau: "Doctorat en Médecine (7 ans)" },
      { nom: "INSPC — Institut National de Santé Publique et Communautaire", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 340 85", parcours: "Santé Publique & Communautaire", niveau: "Licence / Master / Doctorat" },
      { nom: "Institut Catholique de Madagascar (ICM)", type: "Privé", ville: "Antananarivo", region: "Analamanga", contact: "020 22 254 25", parcours: "Sciences de la Santé", niveau: "Licence / Master" },
    ],
    boeny: [
      { nom: "Faculté de Médecine de Mahajanga", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Médecine générale / Spécialités", niveau: "Doctorat en Médecine (7 ans)" },
    ],
    "haute-matsiatra": [
      { nom: "Université de Fianarantsoa — Sciences de la Santé", type: "Public", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "020 75 508 02", parcours: "Sciences médicales", niveau: "Licence / Master" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Département Santé", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Sciences de la Santé", niveau: "Licence" },
    ],
    vakinankaratra: [
      { nom: "Centre de Formation Paramédicale d'Antsirabe", type: "Public", ville: "Antsirabe", region: "Vakinankaratra", contact: "020 44 489 00", parcours: "Sciences médicales de base", niveau: "Licence" },
    ],
  },
  "infirmier": {
    analamanga: [
      { nom: "INSPC — Institut National de Santé Publique et Communautaire", type: "Public", ville: "Iavoloha, Antananarivo", region: "Analamanga", contact: "020 22 340 85", parcours: "Sciences Infirmières", niveau: "Diplôme d'État / Licence" },
      { nom: "EISFA — École d'Infirmier(ère) Saint-François d'Assise", type: "Privé", ville: "Ankadifotsy, Antananarivo", region: "Analamanga", contact: "020 22 000 00", parcours: "Sciences Infirmières", niveau: "Diplôme d'État" },
      { nom: "Institut Paramédical d'Antananarivo", type: "Privé", ville: "Antananarivo", region: "Analamanga", contact: "034 05 000 00", parcours: "Soins Infirmiers & Paramédical", niveau: "Diplôme d'État / Licence" },
    ],
    boeny: [
      { nom: "École Paramédical de Mahajanga", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Sciences Infirmières", niveau: "Diplôme d'État" },
    ],
    "haute-matsiatra": [
      { nom: "Centre de Formation Infirmière de Fianarantsoa", type: "Public", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "020 75 508 02", parcours: "Sciences Infirmières", niveau: "Diplôme d'État" },
    ],
    atsinanana: [
      { nom: "École Paramédical de Toamasina", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Soins Infirmiers", niveau: "Diplôme d'État" },
    ],
    vakinankaratra: [
      { nom: "Centre de Formation Paramédicale d'Antsirabe", type: "Public", ville: "Antsirabe", region: "Vakinankaratra", contact: "020 44 489 00", parcours: "Sciences Infirmières", niveau: "Diplôme d'État" },
    ],
    sofia: [
      { nom: "Centre de Santé de Formation de Mandritsara", type: "Public", ville: "Mandritsara, Sofia", region: "Sofia", contact: "034 00 000 00", parcours: "Soins Infirmiers", niveau: "Diplôme d'État" },
    ],
  },
  "avocat": {
    analamanga: [
      { nom: "Université d'Antananarivo — Faculté de Droit (FACDROIT)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Droit privé / public / des affaires", niveau: "Licence / Master / Doctorat" },
      { nom: "HEDM — Hautes Études en Droit et en Management", type: "Privé", ville: "Soanierana, Antananarivo", region: "Analamanga", contact: "020 22 000 00", parcours: "Droit & Sciences de Gestion", niveau: "Licence / Master" },
      { nom: "IEP — Institut d'Études Politiques Madagascar", type: "Privé", ville: "Ampandrana Ouest, Antananarivo", region: "Analamanga", contact: "034 05 000 00", parcours: "Sciences Politiques & Droit", niveau: "Licence / Master" },
    ],
    boeny: [
      { nom: "Université de Mahajanga — Faculté de Droit", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Droit privé / public", niveau: "Licence / Master" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Faculté de Droit", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Droit", niveau: "Licence / Master" },
    ],
    diana: [
      { nom: "Université d'Antsiranana — Département Droit", type: "Public", ville: "Antsiranana", region: "Diana", contact: "020 82 294 09", parcours: "Droit", niveau: "Licence" },
    ],
  },
  "ingenieur-civil": {
    analamanga: [
      { nom: "École Supérieure Polytechnique d'Antananarivo (ESPA)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Génie Civil & Architecture / BTP", niveau: "Licence / Master / Ingénieur" },
      { nom: "IST Antananarivo", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 401 89", parcours: "Génie Civil & Construction", niveau: "Licence / Master" },
      { nom: "ISPM — Institut Supérieur Polytechnique de Madagascar", type: "Privé", ville: "Ambatomaro, Antananarivo", region: "Analamanga", contact: "034 05 000 00", parcours: "Génie Civil & Architecture", niveau: "Licence / Master" },
    ],
    "haute-matsiatra": [
      { nom: "Université de Fianarantsoa — Sciences et Technologies", type: "Public", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "020 75 508 02", parcours: "Génie Civil", niveau: "Licence / Master" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Sciences et Technologies", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Génie Civil", niveau: "Licence" },
    ],
    vakinankaratra: [
      { nom: "ISPM Antsirabe — Antenne Génie Civil", type: "Privé", ville: "Antsirabe", region: "Vakinankaratra", contact: "034 10 000 00", parcours: "Génie Civil & BTP", niveau: "Licence" },
    ],
  },
  "marketing": {
    analamanga: [
      { nom: "ISCAM — Institut Supérieur de la Communication, des Affaires et du Management", type: "Privé", ville: "Ankadifotsy, Antananarivo", region: "Analamanga", contact: "020 22 348 60", parcours: "Marketing / Communication / Management", niveau: "Licence / Master / MBA" },
      { nom: "INSCAE — Institut National des Sciences Comptables", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 265 14", parcours: "Commerce & Marketing", niveau: "Licence / Master" },
      { nom: "IUM — Institut Universitaire de Madagascar", type: "Privé", ville: "Isoraka, Antananarivo", region: "Analamanga", contact: "034 05 000 00", parcours: "Gestion & Commerce", niveau: "Licence" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Faculté de Gestion", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Marketing & Commerce", niveau: "Licence / Master" },
    ],
    boeny: [
      { nom: "Université de Mahajanga — Faculté de Gestion", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Commerce & Gestion", niveau: "Licence" },
    ],
    diana: [
      { nom: "Université d'Antsiranana — Département Gestion", type: "Public", ville: "Antsiranana", region: "Diana", contact: "020 82 294 09", parcours: "Marketing & Commerce", niveau: "Licence" },
    ],
  },
  "architecte": {
    analamanga: [
      { nom: "École Supérieure Polytechnique d'Antananarivo (ESPA)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Architecture & Urbanisme", niveau: "Licence / Master / Diplôme d'Architecte" },
      { nom: "Institut Catholique de Madagascar (ICM)", type: "Privé", ville: "Antananarivo", region: "Analamanga", contact: "020 22 254 25", parcours: "Architecture & Ingénierie", niveau: "Licence / Master" },
      { nom: "ISPM — Institut Supérieur Polytechnique de Madagascar", type: "Privé", ville: "Ambatomaro, Antananarivo", region: "Analamanga", contact: "034 05 000 00", parcours: "Génie Civil & Architecture", niveau: "Licence / Master" },
    ],
    "haute-matsiatra": [
      { nom: "Université de Fianarantsoa — Sciences et Technologies", type: "Public", ville: "Fianarantsoa", region: "Haute Matsiatra", contact: "020 75 508 02", parcours: "Architecture & Génie Civil", niveau: "Licence" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Sciences et Technologies", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Génie Civil & Architecture", niveau: "Licence" },
    ],
    boeny: [
      { nom: "Université de Mahajanga — Sciences et Technologies", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Architecture & BTP", niveau: "Licence" },
    ],
  },
  "pharmacien": {
    analamanga: [
      { nom: "Faculté de Médecine d'Antananarivo — Département Pharmacie", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Pharmacie & Biochimie", niveau: "Doctorat en Pharmacie (6 ans)" },
      { nom: "CNARP — Centre National d'Application de Recherches Pharmaceutiques", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Pharmacologie & Recherche", niveau: "Master / Doctorat" },
    ],
    boeny: [
      { nom: "Faculté de Médecine de Mahajanga — Pharmacie", type: "Public", ville: "Mahajanga", region: "Boeny", contact: "020 62 227 24", parcours: "Pharmacie", niveau: "Doctorat en Pharmacie" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Sciences de la Santé", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Sciences Pharmaceutiques de base", niveau: "Licence" },
    ],
  },
  "pilote": {
    analamanga: [
      { nom: "Académie Nationale de l'Aviation Civile (ANAC Madagascar)", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 222 22", parcours: "Navigation Aérienne / Formation Pilote", niveau: "Brevet de Pilote Professionnel" },
      { nom: "Centre de Formation Aéronautique d'Ivato", type: "Public", ville: "Ivato, Antananarivo", region: "Analamanga", contact: "020 22 444 44", parcours: "Aéronautique & Pilotage", niveau: "Licence Pilote / CPL" },
    ],
  },
  "technicien-aero": {
    analamanga: [
      { nom: "ATMLM — Air Transport Madagascar Maintenance", type: "Privé", ville: "Ivato, Antananarivo", region: "Analamanga", contact: "020 22 000 00", parcours: "Maintenance Aéronautique", niveau: "BTS / Licence Pro" },
      { nom: "IST Antananarivo — Département Mécanique", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 401 89", parcours: "Mécanique & Électronique", niveau: "Licence / Master" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Mécanique & Industrie", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Mécanique Industrielle", niveau: "Licence" },
    ],
  },
  "designer": {
    analamanga: [
      { nom: "ISCAM — Communication & Design Numérique", type: "Privé", ville: "Ankadifotsy, Antananarivo", region: "Analamanga", contact: "020 22 348 60", parcours: "Communication Visuelle & Design", niveau: "Licence / Master" },
      { nom: "JAU — Jeanne d'Arc University — Communication", type: "Privé", ville: "Ampandrana, Antananarivo", region: "Analamanga", contact: "020 22 651 20", parcours: "Communication & Arts", niveau: "Licence" },
      { nom: "Université d'Antananarivo — Département Arts", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Arts & Design", niveau: "Licence / Master" },
    ],
    atsinanana: [
      { nom: "Université de Toamasina — Lettres & Communication", type: "Public", ville: "Toamasina", region: "Atsinanana", contact: "020 53 324 54", parcours: "Communication & Médias", niveau: "Licence" },
    ],
    diana: [
      { nom: "Université d'Antsiranana — Communication", type: "Public", ville: "Antsiranana", region: "Diana", contact: "020 82 294 09", parcours: "Communication", niveau: "Licence" },
    ],
  },
};

const ETABLISSEMENTS_FALLBACK = [
  { nom: "Université d'Antananarivo", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 326 39", parcours: "Pluridisciplinaire", niveau: "Licence / Master / Doctorat" },
  { nom: "IST Antananarivo", type: "Public", ville: "Antananarivo", region: "Analamanga", contact: "020 22 401 89", parcours: "Sciences et Technologies", niveau: "Licence / Master" },
];

const REGION_LABELS = {
  diana: "Diana", sava: "Sava", sofia: "Sofia", boeny: "Boeny",
  analanjirofo: "Analanjirofo", betsiboka: "Betsiboka",
  "alaotra-mangoro": "Alaotra Mangoro", melaky: "Melaky",
  bongolava: "Bongolava", itasy: "Itasy", analamanga: "Analamanga",
  atsinanana: "Atsinanana", menabe: "Menabe", vakinankaratra: "Vakinankaratra",
  "amoron-i-mania": "Amoron'i Mania", vatovavy: "Vatovavy",
  "haute-matsiatra": "Haute Matsiatra", fitovinany: "Fitovinany",
  ihorombe: "Ihorombe", "atsimo-atsinanana": "Atsimo-Atsinanana",
  "atsimo-andrefana": "Atsimo-Andrefana", androy: "Androy", anosy: "Anosy",
};

const TYPES   = ["Tous", "Public", "Privé"];
const NIVEAUX = ["Tous", "Licence", "Master", "Doctorat", "Ingénieur"];

/* ─── FICHE MODAL ─────────────────────────────────────────────────────────── */
function FicheModal({ fiche, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);
  if (!fiche) return null;

  const getDuree = (niveau) => {
    if (!niveau) return "Variable";
    const n = niveau.toLowerCase();
    if (n.includes("doctorat")) return "7 à 11 ans (Bac +7 à +11)";
    if (n.includes("ingénieur") || n.includes("master")) return "5 ans (Bac +5)";
    if (n.includes("licence") && n.includes("master")) return "3 à 5 ans (Bac +3 à +5)";
    if (n.includes("licence")) return "3 ans (Bac +3)";
    if (n.includes("dut") || n.includes("bts")) return "2 ans (Bac +2)";
    if (n.includes("diplôme d'état")) return "3 ans (Bac +3)";
    return niveau;
  };

  const getAdmission = (type) => type === "Public" ? "Concours d'entrée" : "Sur dossier / entretien";

  const fields = [
    { icon: <FiBook size={15} />,   label: "Etablissement", value: fiche.nom },
    { icon: <FiAward size={15} />,  label: "Mention",       value: fiche.parcours },
    { icon: <FiBook size={15} />,   label: "Parcours",      value: fiche.parcours },
    { icon: <FiAward size={15} />,  label: "Niveau",        value: fiche.niveau },
    { icon: <FiClock size={15} />,  label: "Durée",         value: getDuree(fiche.niveau) },
    { icon: <FiUsers size={15} />,  label: "Admission",     value: getAdmission(fiche.type) },
    { icon: <FiPhone size={15} />,  label: "Contact",       value: fiche.contact },
    { icon: <FiMapPin size={15} />, label: "Localisation",  value: `${fiche.ville}, Madagascar` },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "linear-gradient(160deg,#0f1e50 0%,#0e3a6e 30%,#0a6655 65%,#2a7a10 100%)" }}
    >
      <div className="h-1 w-full flex-shrink-0" style={{ background: "linear-gradient(90deg,#1250c8,#28b090,#a0d820)" }} />
      <div
        className="flex-shrink-0 px-4 sm:px-6 lg:px-10 pt-5 pb-4 flex items-center justify-between gap-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}
      >
        <div className="min-w-0 flex-1">
          <span
            className="inline-block text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full mb-2"
            style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
          >
            Fiche établissement
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug break-words">{fiche.nom}</h2>
          <div className="flex items-start gap-1.5 mt-1.5 text-white/60 text-xs">
            <FiMapPin size={12} className="mt-0.5 flex-shrink-0" />
            <span>{fiche.ville}</span>
          </div>
        </div>
        <button
          type="button" onClick={onClose}
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.12)" }}
        >
          <FiX size={16} className="text-white" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-10 py-5 custom-scrollbar-dark">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {fields.map(({ icon, label, value }) => (
            <div
              key={label} className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
                  <span className="text-white/80">{icon}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</p>
              </div>
              <p className="text-sm font-semibold text-white leading-snug break-words">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .custom-scrollbar-dark::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar-dark::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.3); border-radius: 9999px; }
      `}</style>
    </div>
  );
}

/* ─── SECTION 4 ──────────────────────────────────────────────────────────── */
export default function Section4({ metier, selectedRegion, onRetour }) {
  const navigate = useNavigate();
  const [selectedEtab, setSelectedEtab] = useState(null);
  const [filterType,   setFilterType]   = useState("Tous");
  const [filterNiveau, setFilterNiveau] = useState("Tous");

  const etablissementsBrut = useMemo(() => {
    if (!metier?.id) return ETABLISSEMENTS_FALLBACK;
    const parMetier = ETABLISSEMENTS_PAR_METIER_REGION[metier.id];
    if (!parMetier) return ETABLISSEMENTS_FALLBACK;
    if (selectedRegion && parMetier[selectedRegion]) return parMetier[selectedRegion];
    const tous = Object.values(parMetier).flat();
    return tous.length > 0 ? tous : ETABLISSEMENTS_FALLBACK;
  }, [metier, selectedRegion]);

  const etablissementsFiltres = useMemo(() => {
    return etablissementsBrut.filter((e) => {
      if (filterType   !== "Tous" && e.type !== filterType) return false;
      if (filterNiveau !== "Tous" && !e.niveau.toLowerCase().includes(filterNiveau.toLowerCase())) return false;
      return true;
    });
  }, [etablissementsBrut, filterType, filterNiveau]);

  const mentionLabel = metier ? (metier.mention || metier.label) : "Formation";
  const regionLabel  = selectedRegion ? (REGION_LABELS[selectedRegion] || selectedRegion) : null;

  return (
    <div
      className="relative w-full h-screen overflow-hidden font-['Sora'] flex"
      style={{ background: "linear-gradient(135deg,#1250c8 0%,#1a6dcc 20%,#28b090 55%,#a0d820 80%,#c2e832 100%)" }}
    >
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ── Déco SVG haut droite ── */}
      <div className="absolute top-0 right-0 pointer-events-none z-0 opacity-70 origin-top-right">
        <svg width="220" height="200" viewBox="0 0 260 240" fill="none">
          <path d="M130 38 L232 94 L130 150 L28 94 Z" stroke="white" strokeWidth="2.6" fill="none" strokeLinejoin="round"/>
          <path d="M52 108 Q52 160 130 188 Q208 160 208 108" stroke="white" strokeWidth="2.6" fill="none" strokeLinecap="round"/>
          <line x1="232" y1="94" x2="232" y2="148" stroke="white" strokeWidth="2.6" strokeLinecap="round"/>
          <circle cx="232" cy="155" r="7" fill="white"/>
          <line x1="130" y1="150" x2="130" y2="188" stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="5 4"/>
          <circle cx="130" cy="94" r="5" fill="white"/>
        </svg>
      </div>

      {/* ── Silhouette ville bas ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="90" viewBox="0 0 400 100" preserveAspectRatio="xMidYMax meet" fill="none">
          <rect x="10"  y="55" width="30" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="50"  y="35" width="40" height="65" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="100" y="50" width="25" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="135" y="30" width="50" height="70" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="195" y="45" width="35" height="55" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="240" y="55" width="28" height="45" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="278" y="38" width="42" height="62" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="330" y="50" width="30" height="50" stroke="white" strokeWidth="1.5" fill="none"/>
          <rect x="370" y="60" width="25" height="40" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
      </div>

      {/* ── Vague centrale ── */}
      <div className="absolute top-[45%] left-0 right-0 pointer-events-none z-0 opacity-10">
        <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="none">
          <path d="M0,30 Q150,10 300,30 T600,30 T900,30 T1200,30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* ══════════════════════════════════════════
          Colonne gauche — Titre + Filtres + Liste
      ══════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col h-full w-full lg:w-[55%] xl:w-[52%] px-6 sm:px-10 lg:px-12 xl:px-14 pt-8 pb-4">

        {/* Bouton retour */}
        <button
          onClick={onRetour}
          className="self-start text-white/80 hover:text-white transition-colors w-11 h-11 flex items-center justify-center mb-3 shrink-0"
          aria-label="Retour"
        >
          <IoArrowBackCircleOutline size={38} />
        </button>

        {/* Titre */}
        <div className="shrink-0 mb-4">
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight mb-3">
            UNIVERSITÉS<br />&amp; INSTITUTS
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block bg-white/90 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold text-gray-800">
              {mentionLabel}
            </span>
            {regionLabel && (
              <span className="inline-flex items-center gap-1.5 bg-black/15 border border-white/30 rounded-full px-3 py-1.5 text-xs font-semibold text-white">
                <FiMapPin size={11} />{regionLabel}
              </span>
            )}
          </div>
        </div>

        {/* Filtres */}
        <div className="shrink-0 mb-4 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-white/70 font-semibold mr-1">Type :</span>
            {TYPES.map((t) => (
              <button
                key={t} type="button" onClick={() => setFilterType(t)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={filterType === t
                  ? { background: "white", color: "#1250c8" }
                  : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-white/70 font-semibold mr-1">Niveau :</span>
            {NIVEAUX.map((n) => (
              <button
                key={n} type="button" onClick={() => setFilterNiveau(n)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                style={filterNiveau === n
                  ? { background: "white", color: "#1250c8" }
                  : { background: "rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.9)" }}
              >
                {n}
              </button>
            ))}
            {(filterType !== "Tous" || filterNiveau !== "Tous") && (
              <button
                type="button"
                onClick={() => { setFilterType("Tous"); setFilterNiveau("Tous"); }}
                className="text-xs text-white/60 hover:text-white underline underline-offset-2 ml-1"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>

        {/* Compteur */}
        <p className="shrink-0 text-xs text-white/60 mb-3 font-medium">
          {etablissementsFiltres.length} établissement{etablissementsFiltres.length !== 1 ? "s" : ""}
        </p>

        {/* Liste scrollable */}
        <div className="flex-1 overflow-y-auto scrollbar-thin-white space-y-2.5 pr-1 pb-4">
          {etablissementsFiltres.length > 0 ? (
            etablissementsFiltres.map((etab, i) => (
              <button
                key={i} type="button" onClick={() => setSelectedEtab(etab)}
                className="group w-full text-left rounded-2xl px-4 py-3.5 flex items-start gap-3 cursor-pointer transition-all hover:shadow-xl hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.7)" }}
              >
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                  style={{ background: etab.type === "Public"
                    ? "linear-gradient(135deg,#1250c8,#28b090)"
                    : "linear-gradient(135deg,#28b090,#a0d820)" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-sm text-gray-900 leading-snug break-words">{etab.nom}</span>
                    <FiChevronRight size={16} className="text-gray-400 group-hover:text-blue-600 transition-colors flex-shrink-0 mt-0.5" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: etab.type === "Public" ? "rgba(18,80,200,0.12)" : "rgba(40,176,144,0.12)",
                        color: etab.type === "Public" ? "#1250c8" : "#0a6655",
                      }}
                    >
                      {etab.type}
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-0.5">
                      <FiMapPin size={9} />{etab.ville}
                    </span>
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="rounded-2xl px-5 py-8 text-center text-sm text-gray-500" style={{ background: "rgba(255,255,255,0.85)" }}>
              Aucun établissement ne correspond à ces filtres.
            </div>
          )}
        </div>

        {/* Home */}
        <div className="shrink-0 flex justify-center pt-3">
          <button
            onClick={() => navigate("/acceuil/orientation")}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Accueil"
          >
            <HiOutlineHome size={26} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Colonne droite — Panneau info (Desktop)
      ══════════════════════════════════════════ */}
      <div className="hidden lg:flex relative z-10 flex-1 flex-col items-center justify-center px-10 xl:px-14 py-12 h-full">
        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center"
          style={{
            background: "rgba(8, 20, 60, 0.55)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)",
          }}
        >
          {/* Icône */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.22)",
              backdropFilter: "blur(10px)",
            }}
          >
            <FiBook size={28} className="text-white" />
          </div>

          {/* Compteur */}
          <h2 className="text-white font-black text-3xl mb-1 drop-shadow">
            {etablissementsFiltres.length}
          </h2>
          <p className="text-white/85 text-sm font-semibold mb-6 drop-shadow">
            établissement{etablissementsFiltres.length !== 1 ? "s" : ""} disponible{etablissementsFiltres.length !== 1 ? "s" : ""}
          </p>

          {/* Champs */}
          <div className="space-y-3 text-left">
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-0.5">Métier</p>
              <p className="text-white text-sm font-semibold drop-shadow">{metier?.label || "—"}</p>
            </div>

            {regionLabel && (
              <div
                className="rounded-xl px-4 py-3"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-0.5">Région</p>
                <p className="text-white text-sm font-semibold drop-shadow">{regionLabel}</p>
              </div>
            )}

            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              <p className="text-white/55 text-[10px] uppercase tracking-widest font-bold mb-0.5">Mention</p>
              <p className="text-white text-sm font-semibold drop-shadow">{mentionLabel}</p>
            </div>
          </div>

          <p className="text-white/55 text-xs mt-6 leading-relaxed drop-shadow">
            Cliquez sur un établissement<br />pour voir sa fiche complète
          </p>
        </div>
      </div>

      {/* ── Fiche Modal ── */}
      {selectedEtab && <FicheModal fiche={selectedEtab} onClose={() => setSelectedEtab(null)} />}

      <style>{`
        .scrollbar-thin-white::-webkit-scrollbar { width: 5px; }
        .scrollbar-thin-white::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 999px; }
        .scrollbar-thin-white::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.40); }
      `}</style>
    </div>
  );
}
