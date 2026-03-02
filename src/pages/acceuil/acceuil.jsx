// src/pages/acceuil/acceuil.jsx
import { Link } from 'react-router-dom';

const Acceuil = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* En-tête simple pour la page d'accueil */}
      <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-700">Orientation</div>
        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition">
          Espace Admin
        </Link>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
          Trouvez votre voie professionnelle
        </h1>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl">
          Découvrez les filières d'études et les métiers qui correspondent à votre profil, vos compétences et vos aspirations.
        </p>
        
        <div className="flex gap-4">
          <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 shadow-lg transition transform hover:-translate-y-1">
            Commencer le test
          </button>
          <button className="px-8 py-3 bg-white text-blue-600 font-semibold border border-blue-200 rounded-full hover:bg-blue-50 transition">
            Explorer les filières
          </button>
        </div>
      </main>
    </div>
  );
};

export default Acceuil;
