import { useState, useEffect } from 'react';

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  // 1. Détection de l'appareil (iOS ou autre) au chargement
  const [isIOS] = useState(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  });

  // 2. Initialisation conditionnelle de l'affichage du Toast
  const [showToast, setShowToast] = useState(() => {
    if (typeof window === 'undefined') return false;
    
    // Vérifier si l'app est déjà en mode "Application installée"
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         window.navigator.standalone === true;
    
    // Vérifier si l'utilisateur a déjà cliqué sur la croix pour fermer le toast
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed');
    
    if (isStandalone || hasDismissed) return false;
    
    // Si c'est iOS, on affiche le toast immédiatement (car iOS ne déclenche pas d'événement)
    return /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  });

  useEffect(() => {
    // 3. Capture l'événement d'installation autorisé par le navigateur
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Empêche l'affichage automatique du navigateur
      setDeferredPrompt(e);
      setShowToast(true); // Affiche notre beau Toast Tailwind
    };

    // 4. Écoute quand l'application est finalement installée pour cacher le toast
    const handleAppInstalled = () => {
      setShowToast(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Fonction pour déclencher l'installation quand l'utilisateur clique sur le bouton
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('Installation acceptée');
    }
    
    setDeferredPrompt(null);
    setShowToast(false);
  };

  // Fonction pour fermer le Toast et s'en souvenir pour les prochaines visites
  const handleClose = () => {
    setShowToast(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Si showToast est faux, on ne rend rien du tout
  if (!showToast) return null;

  return (
    // Conteneur fixe en bas à DROITE (bottom-6 right-6)
    <div className="fixed bottom-6 right-6 w-[340px] bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-4 z-[9999] transition-all transform duration-300 translate-y-0 opacity-100">
      
      {/* Bouton de fermeture absolu en haut à droite */}
      <button 
        onClick={handleClose} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1.5 transition-colors focus:outline-none"
        aria-label="Fermer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Contenu principal */}
      <div className="flex flex-row items-center gap-4 mb-3 pr-4">
        <div className="flex-shrink-0">
          <img src="/pwa-192x192.png" alt="Logo" className="w-12 h-12 rounded-lg shadow-sm" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Installer l'application</h3>
          <p className="text-gray-500 text-xs mt-0.5 leading-tight">
            {isIOS 
              ? "Sur iOS : touchez Partager puis 'Sur l'écran d'accueil'."
              : "Ajoutez Orientation Scolaire à votre bureau pour un accès rapide."}
          </p>
        </div>
      </div>

      {/* Boutons d'action (Cachés sur iOS car l'installation automatique y est impossible) */}
      {!isIOS && (
        <div className="flex gap-2 w-full mt-3">
          <button 
            onClick={handleClose} 
            className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Plus tard
          </button>
          <button 
            onClick={handleInstallClick} 
            className="flex-1 px-3 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm transition-colors"
          >
            Installer
          </button>
        </div>
      )}
    </div>
  );
};

export default InstallPWA;
