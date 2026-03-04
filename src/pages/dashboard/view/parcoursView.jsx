import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ParcoursView() {
  const [parcours, setParcours] = useState([
    {
      id: 1,
      label: "Licence en Informatique",
      mention: "Informatique",
      duree: "3 ans",
      niveau: "Licence",
      conditions: "Bac série C ou D",
      description: "Formation complète en informatique générale",
      objectifs: "Maîtriser les fondamentaux de l'informatique",
      debouches: "Développeur, Administrateur système, Analyste",
    },
    {
      id: 2,
      label: "Master en Data Science",
      mention: "Mathématiques Appliquées",
      duree: "2 ans",
      niveau: "Master",
      conditions: "Licence en Informatique ou Maths",
      description: "Formation avancée en data science et IA",
      objectifs: "Analyser et extraire de la valeur des données",
      debouches: "Data Scientist, Data Engineer, ML Engineer",
    },
    {
      id: 3,
      label: "Diplôme d'Architecte",
      mention: "Architecture",
      duree: "5 ans",
      niveau: "Doctorat",
      conditions: "Bac série C ou D",
      description: "Formation professionnelle en architecture",
      objectifs: "Concevoir et superviser des projets architecturaux",
      debouches: "Architecte, Chef de projet, Maître d'œuvre",
    },
    {
      id: 4,
      label: "Licence en Gestion",
      mention: "Gestion",
      duree: "3 ans",
      niveau: "Licence",
      conditions: "Bac toutes séries",
      description: "Formation en gestion d'entreprise",
      objectifs: "Former des gestionnaires",
      debouches: "Manager, Commercial, Responsable RH",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [selectedParcours, setSelectedParcours] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    mention: "",
    duree: "",
    niveau: "",
    conditions: "",
    description: "",
    objectifs: "",
    debouches: "",
  });

  // Configuration des toasts
  const showToast = (message, type = 'success') => {
    toast[type](message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  // Validation du formulaire
  const isFormValid = () => {
    return formData.label.trim() !== "" && formData.mention.trim() !== "";
  };

  // Options pour les combobox
  const mentionOptions = [
    "Informatique",
    "Mathématiques",
    "Mathématiques Appliquées",
    "Physique",
    "Chimie",
    "Biologie",
    "Architecture",
    "Génie Civil",
    "Gestion",
    "Économie",
    "Droit",
    "Lettres Modernes",
    "Histoire",
    "Géographie",
    "Philosophie",
    "Sociologie",
    "Psychologie",
    "Médecine",
    "Pharmacie",
    "Sciences de l'Éducation"
  ];

  const niveauOptions = ["Licence", "Master", "Doctorat"];

  const filteredParcours = parcours.filter(
    (p) =>
      p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.mention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.niveau.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenModal = (p = null) => {
    if (p) {
      setEditingId(p.id);
      setFormData({
        label: p.label,
        mention: p.mention,
        duree: p.duree,
        niveau: p.niveau,
        conditions: p.conditions,
        description: p.description,
        objectifs: p.objectifs,
        debouches: p.debouches,
      });
    } else {
      setEditingId(null);
      setFormData({
        label: "",
        mention: "",
        duree: "",
        niveau: "",
        conditions: "",
        description: "",
        objectifs: "",
        debouches: "",
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!isFormValid()) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }

    if (editingId) {
      setParcours(
        parcours.map((p) => (p.id === editingId ? { ...p, ...formData } : p)),
      );
      showToast('Parcours modifié avec succès', 'success');
    } else {
      setParcours([...parcours, { id: Date.now(), ...formData }]);
      showToast('Parcours ajouté avec succès', 'success');
    }
    setShowModal(false);
    setFormData({
      label: "",
      mention: "",
      duree: "",
      niveau: "",
      conditions: "",
      description: "",
      objectifs: "",
      debouches: "",
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setParcours(parcours.filter((p) => p.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    showToast('Parcours supprimé avec succès', 'success');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Parcours de Formation
        </h1>
        <p className="text-gray-500">
          Gérez les parcours de formation disponibles
        </p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un parcours..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus /> Ajouter
        </button>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Parcours
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Mention
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Durée
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Niveau
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredParcours.map((p) => (
              <tr
                key={p.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-gray-600">{p.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {p.label}
                </td>
                <td className="px-6 py-4 text-gray-600">{p.mention}</td>
                <td className="px-6 py-4 text-gray-600">{p.duree}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold">
                    {p.niveau}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => handleOpenModal(p)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(p.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ajouter / Modifier */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Modifier le parcours" : "Ajouter un parcours"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parcours <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Parcours"
                    value={formData.label}
                    onChange={(e) =>
                      setFormData({ ...formData, label: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mention <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.mention}
                    onChange={(e) =>
                      setFormData({ ...formData, mention: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Sélectionner une mention</option>
                    {mentionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée
                  </label>
                  <input
                    type="text"
                    placeholder="Durée"
                    value={formData.duree}
                    onChange={(e) =>
                      setFormData({ ...formData, duree: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Niveau
                  </label>
                  <select
                    value={formData.niveau}
                    onChange={(e) =>
                      setFormData({ ...formData, niveau: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Sélectionner un niveau</option>
                    {niveauOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid()}
                className={`flex-1 px-4 py-2.5 rounded-lg ${
                  isFormValid() 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaExclamationTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirmer la suppression
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Êtes-vous sûr de vouloir supprimer ce parcours ? Cette action est irréversible.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCancelDelete}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fiche parcours (détail) */}
      {selectedParcours && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900">
                  {selectedParcours.label}
                </h2>
                <div className="text-sm text-gray-600 mt-1">
                  {selectedParcours.mention}
                </div>
              </div>
              <button
                onClick={() => setSelectedParcours(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Durée
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedParcours.duree}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Niveau
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedParcours.niveau}
                </p>
              </div>

              <div className="col-span-2">
                <p className="text-xs text-gray-500 font-semibold uppercase">
                  Conditions d'admission
                </p>
                <p className="font-semibold text-gray-900">
                  {selectedParcours.conditions}
                </p>
              </div>
            </div>

            <div className="space-y-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">
                  Description
                </p>
                <p className="text-gray-700">{selectedParcours.description}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">
                  Objectifs de formation
                </p>
                <p className="text-gray-700">{selectedParcours.objectifs}</p>
              </div>

              <div>
                <p className="text-sm font-bold text-gray-900 mb-2">
                  Débouchés professionnels
                </p>
                <p className="text-gray-700">{selectedParcours.debouches}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedParcours(null)}
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold"
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  handleOpenModal(selectedParcours);
                  setSelectedParcours(null);
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold"
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}