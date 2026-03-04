import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaExclamationTriangle } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MentionsView() {
  const [mentions, setMentions] = useState([
    { id: 1, label: "Architecture & BTP", description: "Architecture et Bâtiment" },
    { id: 2, label: "Informatique & Numérique", description: "Développement, réseaux, data" },
    { id: 3, label: "Sciences de la Santé", description: "Médecine, soins, santé publique" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ label: "", description: "" });

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
    return formData.label.trim() !== "" && formData.description.trim() !== "";
  };

  const filtered = mentions.filter((m) =>
    m.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (m = null) => {
    if (m) {
      setEditingId(m.id);
      setFormData({ label: m.label, description: m.description });
    } else {
      setEditingId(null);
      setFormData({ label: "", description: "" });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    if (!isFormValid()) {
      showToast("Veuillez remplir tous les champs obligatoires", "error");
      return;
    }
    
    if (editingId) {
      setMentions(mentions.map((m) => (m.id === editingId ? { ...m, ...formData } : m)));
      showToast('Mention modifiée avec succès', 'success');
    } else {
      setMentions([...mentions, { id: Date.now(), ...formData }]);
      showToast('Mention ajoutée avec succès', 'success');
    }
    setShowModal(false);
    setFormData({ label: "", description: "" });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setMentions(mentions.filter((m) => m.id !== deleteId));
    setShowDeleteModal(false);
    setDeleteId(null);
    showToast('Mention supprimée avec succès', 'success');
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
      <ToastContainer />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mentions</h1>
        <p className="text-gray-500">Gérez les mentions (domaines)</p>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher une mention..."
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

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Mention</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Description</th>
              <th className="px-6 py-3 text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-600">{m.id}</td>
                <td className="px-6 py-4 font-medium text-gray-900">{m.label}</td>
                <td className="px-6 py-4 text-gray-600">{m.description}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button
                    onClick={() => handleOpenModal(m)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(m.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <FaTrash size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Modifier la mention" : "Ajouter une mention"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mention <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nom de la mention"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
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
                  Êtes-vous sûr de vouloir supprimer cette mention ? Cette action est irréversible.
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