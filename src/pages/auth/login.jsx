import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login as loginService } from "../../services/auth.services";
import { useAuth } from "../../App"; 

const Login = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth(); 
  
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleForgotPassword = () => {
    toast.info(
      "Veuillez contacter l'administrateur pour réinitialiser votre mot de passe",
      {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (!identifier.trim() || !password.trim()) {
      setErrors({ general: "Veuillez remplir tous les champs" });
      setLoading(false);
      return;
    }

    try {
      const response = await loginService(identifier, password, rememberMe);
      
      const { utilisateur, token } = response;
      
      authLogin(token, utilisateur.role, rememberMe, utilisateur);

      toast.success(
        `Bienvenue ${utilisateur.prenom} ${utilisateur.nom} !`,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );

      setTimeout(() => {
        const uuid = Math.random().toString(36).substring(2, 11);
        if (utilisateur.role === "admin") {
          navigate(`/dashboard/admin/${uuid}`, { replace: true });
        } else {
          navigate(`/acceuil/orientation/${uuid}`, { replace: true });
        }
      }, 2000);

    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Erreur de connexion. Veuillez réessayer.";

      if (error.response?.status === 401) {
        setErrors({ general: message });
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else if (error.response?.status === 422) {
        setErrors({ general: "Veuillez remplir tous les champs correctement." });
        toast.warning("Champs manquants ou invalides.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      } else {
        setErrors({ general: "Erreur serveur. Réessayez plus tard." });
        toast.error("Erreur serveur. Réessayez plus tard.", {
          position: "top-right",
          autoClose: 5000,
          theme: "colored",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="relative bg-white w-full max-w-md rounded-2xl border border-gray-200 animate-fade-in-up mx-auto flex flex-col transition-all duration-300 shadow-lg">

          {/* Header */}
          <div className="px-8 pt-8 pb-4 text-center mb-2">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-md shadow-blue-500/30">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              Connexion
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              Bon retour parmi nous
            </p>
          </div>

          {/* Formulaire */}
          <div className="flex-1 px-8 pb-8">

            {/* Bannière erreur générale */}
            {errors.general && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs font-medium text-center animate-shake flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email ou Nom d'utilisateur */}
              <div className="relative group">
                <input
                  type="text"
                  id="identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="identifier"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  E-mail ou nom d&apos;utilisateur
                </label>
              </div>

              {/* Mot de passe */}
              <div className="relative group">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block px-4 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="password"
                  className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
                >
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Remember me et Mot de passe oublié */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">
                    Rester connecté
                  </span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              {/* Bouton Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition duration-200 font-bold shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98] text-sm flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connexion en cours...</span>
                  </>
                ) : (
                  <span>Se connecter</span>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-2 text-center">
              <a
                href="/"
                className="text-xs text-gray-500 hover:text-blue-600 transition-colors"
              >
                Retour à l&apos;accueil
              </a>
            </div>
          </div>
        </div>

        {/* Styles CSS pour les animations */}
        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.4s ease-out forwards; }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-3px); }
            40%, 80% { transform: translateX(3px); }
          }
          .animate-shake { animation: shake 0.3s ease-in-out; }
        `}</style>
      </div>
    </>
  );
};

export default Login;