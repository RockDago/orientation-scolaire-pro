import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EtablissementsView() {
  const [etablissements, setEtablissements] = useState([
    {
      id: 1,
      nom: "Université XRAY",
      province: "Antananarivo",
      region: "Analamanga",
      type: "Public",
      mention: "Informatique",
      parcours: "Génie logiciel",
      metier: "Développeur Full Stack",
      niveau: "Licence",
      duree: "3 ans",
      admission: "Concours",
      contact: "020 22 000 00",
    },
    {
      id: 2,
      nom: "École Polytechnique",
      province: "Mahajanga",
      region: "Boeny",
      type: "Public",
      mention: "Architecture",
      parcours: "Architecture & BTP",
      metier: "Architecte",
      niveau: "Master",
      duree: "2 ans",
      admission: "Concours",
      contact: "020 62 227 24",
    },
    {
      id: 3,
      nom: "Université Digitale Nova",
      province: "Toliara",
      region: "Atsimo-Andrefana",
      type: "Privé",
      mention: "Data Science",
      parcours: "Data Science",
      metier: "Data Scientist",
      niveau: "Licence",
      duree: "3 ans",
      admission: "Dossier",
      contact: "020 33 444 55",
    },
  ]);

  // Options pour les combobox
  const provinceOptions = ["Antananarivo", "Mahajanga", "Toliara", "Toamasina", "Fianarantsoa", "Antsiranana"];
  const regionOptions = {
    Antananarivo: ["Analamanga", "Itasy", "Vakinankaratra", "Bongolava"],
    Mahajanga: ["Boeny", "Sofia", "Betsiboka", "Melaky"],
    Toliara: ["Atsimo-Andrefana", "Androy", "Anosy", "Menabe"],
    Toamasina: ["Atsinanana", "Alaotra-Mangoro", "Analanjirofo"],
    Fianarantsoa: ["Haute Matsiatra", "Amoron'i Mania", "Vatovavy", "Fitovinany", "Atsimo-Atsinanana", "Ihorombe"],
    Antsiranana: ["Diana", "Sava"],
  };
  const typeOptions = ["Public", "Privé"];
  const mentionOptions = ["Informatique", "Architecture", "Data Science", "Génie Civil", "Médecine", "Droit", "Gestion", "Communication"];
  const parcoursOptions = {
    Informatique: ["Génie logiciel", "Réseaux", "Intelligence artificielle", "Sécurité informatique"],
    Architecture: ["Architecture & BTP", "Urbanisme", "Design d'intérieur"],
    "Data Science": ["Data Science", "Big Data", "Business Intelligence"],
    "Génie Civil": ["Bâtiment", "Travaux publics", "Géotechnique"],
    Médecine: ["Médecine générale", "Chirurgie", "Pédiatrie"],
    Droit: ["Droit public", "Droit privé", "Droit des affaires"],
    Gestion: ["Management", "Finance", "Marketing"],
    Communication: ["Journalisme", "Communication digitale", "Relations publiques"],
  };
  const metierOptions = {
    "Informatique": ["Développeur Full Stack", "Développeur Backend", "Développeur Frontend", "DevOps", "Administrateur système", "Administrateur réseau"],
    "Architecture": ["Architecte", "Urbaniste", "Designer d'intérieur", "Architecte paysagiste"],
    "Data Science": ["Data Scientist", "Data Analyst", "Data Engineer", "ML Engineer"],
    "Génie Civil": ["Ingénieur BTP", "Chef de chantier", "Conducteur de travaux", "Géotechnicien"],
    "Médecine": ["Médecin généraliste", "Chirurgien", "Pédiatre", "Cardiologue"],
    "Droit": ["Avocat", "Juriste", "Notaire", "Magistrat"],
    "Gestion": ["Manager", "Analyste financier", "Chef de produit", "Consultant"],
    "Communication": ["Journaliste", "Community Manager", "Chargé de communication", "Responsable RP"],
  };
  const niveauOptions = ["Licence", "Master", "Doctorat", "BTS", "DUT", "Certification"];
  const dureeOptions = ["1 an", "2 ans", "3 ans", "4 ans", "5 ans", "6 ans"];
  const admissionOptions = ["Concours", "Dossier", "Entretien", "Test", "Concours + Dossier"];

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    province: "",
    region: "",
    type: "Public",
    mention: "",
    parcours: "",
    metier: "",
    niveau: "",
    duree: "",
    admission: "",
    contact: "",
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
    return (
      formData.nom.trim() !== "" &&
      formData.province !== "" &&
      formData.region !== "" &&
      formData.type !== "" &&
      formData.mention !== "" &&
      formData.parcours !== "" &&
      formData.metier !== "" &&
      formData.niveau !== "" &&
      formData.duree !== "" &&
      formData.admission !== "" &&
      formData.contact.trim() !== ""
    );
  };

  const filteredEtablissements = etablissements.filter(
    (e) =>
      e.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.mention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.parcours.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.metier.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenModal = (e = null) => {
    if (e) {
      setEditingId(e.id);
      setFormData({
        nom: e.nom,
        province: e.province,
        region: e.region,
        type: e.type,
        mention: e.mention,
        parcours: e.parcours,
        metier: e.metier,
        niveau: e.niveau,
        duree: e.duree,
        admission: e.admission,
        contact: e.contact,
      });
    } else {
      setEditingId(null);
      setFormData({
        nom: "",
        province: "",
        region: "",
        type: "Public",
        mention: "",
        parcours: "",
        metier: "",
        niveau: "",
        duree: "",
        admission: "",
        contact: "",
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
      setEtablissements(
        etablissements.map((e) =>
          e.id === editingId ? { ...e, ...formData } : e,
        ),
      );
      showToast('Établissement modifié avec succès', 'success');
    } else {
      setEtablissements([...etablissements, { id: Date.now(), ...formData }]);
      showToast('Établissement ajouté avec succès', 'success');
    }
    setShowModal(false);
    setFormData({
      nom: "",
      province: "",
      region: "",
      type: "Public",
      mention: "",
      parcours: "",
      metier: "",
      niveau: "",
      duree: "",
      admission: "",
      contact: "",
    });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setEtablissements(etablissements.filter((e) => e.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    showToast('Établissement supprimé avec succès', 'success');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleProvinceChange = (e) => {
    const newProvince = e.target.value;
    setFormData({ 
      ...formData, 
      province: newProvince,
      region: "" 
    });
  };

  const handleMentionChange = (e) => {
    const newMention = e.target.value;
    setFormData({ 
      ...formData, 
      mention: newMention,
      parcours: "", 
      metier: "" 
    });
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <ToastContainer />
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Établissements
        </h1>
        <p className="text-gray-500">Gérez les établissements d'enseignement</p>
      </div>

      {/* Barre de recherche et bouton */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un établissement..."
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
                Établissement
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Province
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Région
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Type
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Mention
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Parcours
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Métier
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Niveau
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Durée
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Admission
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Contact
              </th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredEtablissements.map((e) => (
              <tr
                key={e.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900">{e.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{e.nom}</td>
                <td className="px-6 py-4 text-gray-600">{e.province}</td>
                <td className="px-6 py-4 text-gray-600">{e.region}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-lg font-semibold text-sm ${
                      e.type === "Public"
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-purple-100 text-purple-600"
                    }`}
                  >
                    {e.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{e.mention}</td>
                <td className="px-6 py-4 text-gray-600">{e.parcours}</td>
                <td className="px-6 py-4 text-gray-600">{e.metier}</td>
                <td className="px-6 py-4 text-gray-600">{e.niveau}</td>
                <td className="px-6 py-4 text-gray-600">{e.duree}</td>
                <td className="px-6 py-4 text-gray-600">{e.admission}</td>
                <td className="px-6 py-4 text-gray-600">{e.contact}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(e)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(e.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full mx-4 my-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId
                  ? "Modifier l'établissement"
                  : "Ajouter un établissement"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-[60vh] overflow-y-auto px-1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l'établissement <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: Université XRAY"
                  value={formData.nom}
                  onChange={(e) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Province <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.province}
                  onChange={handleProvinceChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez une province</option>
                  {provinceOptions.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Région <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({ ...formData, region: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.province}
                  required
                >
                  <option value="">Sélectionnez une région</option>
                  {formData.province && regionOptions[formData.province]?.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {typeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mention <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.mention}
                  onChange={handleMentionChange}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez une mention</option>
                  {mentionOptions.map(mention => (
                    <option key={mention} value={mention}>{mention}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parcours <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.parcours}
                  onChange={(e) =>
                    setFormData({ ...formData, parcours: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.mention}
                  required
                >
                  <option value="">Sélectionnez un parcours</option>
                  {formData.mention && parcoursOptions[formData.mention]?.map(parcours => (
                    <option key={parcours} value={parcours}>{parcours}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Métier <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.metier}
                  onChange={(e) =>
                    setFormData({ ...formData, metier: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.mention}
                  required
                >
                  <option value="">Sélectionnez un métier</option>
                  {formData.mention && metierOptions[formData.mention]?.map(metier => (
                    <option key={metier} value={metier}>{metier}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Niveau <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.niveau}
                  onChange={(e) =>
                    setFormData({ ...formData, niveau: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez un niveau</option>
                  {niveauOptions.map(niveau => (
                    <option key={niveau} value={niveau}>{niveau}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Durée <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.duree}
                  onChange={(e) =>
                    setFormData({ ...formData, duree: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez une durée</option>
                  {dureeOptions.map(duree => (
                    <option key={duree} value={duree}>{duree}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Admission <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.admission}
                  onChange={(e) =>
                    setFormData({ ...formData, admission: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Sélectionnez un mode d'admission</option>
                  {admissionOptions.map(admission => (
                    <option key={admission} value={admission}>{admission}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: 020 22 000 00"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
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
                  Êtes-vous sûr de vouloir supprimer cet établissement ? Cette action est irréversible.
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
    </div>
  );
}