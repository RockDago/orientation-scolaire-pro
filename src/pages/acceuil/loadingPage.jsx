// src/pages/acceuil/loadingPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige vers /acceuil après 3 secondes (3000 millisecondes)
    const timer = setTimeout(() => {
      navigate('/acceuil', { replace: true }); 
      // replace: true empêche l'utilisateur de revenir sur la page de chargement avec le bouton "Retour" du navigateur
    }, 3000);

    // Nettoyage du timer si le composant est démonté avant la fin
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-blue-600 flex flex-col items-center justify-center text-white">
      {/* Animation simple de chargement avec Tailwind */}
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
      <h1 className="text-3xl font-bold tracking-wider">Orientation Scolaire</h1>
      <p className="mt-2 text-blue-200">Chargement de l'application...</p>
    </div>
  );
};

export default LoadingPage;
