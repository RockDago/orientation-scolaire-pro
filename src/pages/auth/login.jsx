import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login as loginService } from "../../services/auth.services";
import { useAuth } from "../../App";
import backgroundImage from "../../assets/mesupres.png";
import mesupresLogo from "../../assets/logo.png";

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

      toast.success(`Bienvenue ${utilisateur.prenom} ${utilisateur.nom} !`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        if (utilisateur.role === "admin") {
          navigate("/dashboard/admin", { replace: true });
        } else {
          navigate("/acceuil/orientation", { replace: true });
        }
      }, 2000);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Erreur de connexion. Veuillez réessayer.";

      if (error.response?.status === 401 || error.response?.status === 403) {
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

      <div
        className="relative min-h-screen overflow-hidden bg-slate-950"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/55 to-slate-950/80" />

        <div className="relative z-10 flex min-h-screen items-center px-4 py-5 sm:px-6 sm:py-8 lg:px-12 lg:py-8">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-2 lg:items-center lg:gap-8">
            <div className="hidden flex-col justify-between text-white lg:flex">
              <div className="max-w-xl animate-fade-in-up">
                <div className="mb-1 flex items-center justify-center gap-3 lg:mb-8 lg:justify-start lg:gap-4">
                  <img
                    src={mesupresLogo}
                    alt="Logo MESUPRES"
                    className="h-14 w-auto object-contain sm:h-16 lg:h-20"
                  />
                  <div className="hidden lg:block max-w-3xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/65">
                      Plateforme officielle
                    </p>
                    <p className="mt-1 text-xl font-black leading-tight text-white xl:text-2xl">
                      Ministère de l&apos;Enseignement Supérieur et de la Recherche Scientifique
                    </p>
                  </div>
                </div>
                <h1 className="hidden max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl lg:block lg:text-6xl">
                  Bienvenue sur votre espace d&apos;accès
                </h1>
              </div>

              <div className="hidden max-w-2xl animate-fade-in-up lg:mt-16 lg:block">
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  Orientation scolaire &amp; professionnelle
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Une plateforme pensée pour accompagner les apprenants dans
                  leurs choix académiques et professionnels avec des parcours
                  clairs, modernes et accessibles.
                </p>
              </div>
            </div>

            <div className="mx-auto flex w-full max-w-md animate-fade-in-up flex-col justify-center sm:max-w-xl lg:mx-0 lg:max-w-md lg:justify-self-end">
              <div className="mb-5 px-2 text-center lg:hidden">
                <img
                  src={mesupresLogo}
                  alt="Logo MESUPRES"
                  className="mx-auto mb-3 h-20 w-auto object-contain sm:h-24"
                />
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-100/80 sm:text-sm">
                  Bienvenue sur votre espace d&apos;accès
                </p>
                <h2 className="mx-auto mt-1 max-w-sm text-2xl font-bold leading-tight text-white sm:max-w-lg sm:text-3xl">
                  Orientation scolaire &amp; professionnelle
                </h2>
              </div>

              <div className="w-full rounded-[1.75rem] border border-white/15 bg-white/12 px-6 py-8 shadow-2xl shadow-black/40 backdrop-blur-xl sm:rounded-[2rem] sm:px-9 sm:py-10 lg:p-8">
                <div className="mb-8 text-center sm:mb-9 lg:mb-6">
                  <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Connexion
                  </h2>
                  <p className="mt-3 text-xs font-medium text-white/70 sm:mt-4 sm:text-sm lg:mt-2">
                    Accédez à votre espace personnel
                  </p>
                </div>

                {errors.general && (
                  <div className="mb-4 flex items-center justify-center gap-2 rounded-xl border border-red-300/30 bg-red-500/15 px-3 py-2 text-center text-xs font-medium text-red-100 animate-shake">
                    <svg
                      className="h-4 w-4 flex-shrink-0"
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

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 sm:space-y-7 lg:space-y-5"
                >
                  <div className="relative group">
                    <input
                      type="text"
                      id="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-sm text-white backdrop-blur-md transition placeholder:text-white/60 focus:border-cyan-300/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-200/30 sm:rounded-2xl sm:px-5 sm:py-[1.125rem] sm:text-base lg:py-4"
                      placeholder="E-mail ou nom d'utilisateur"
                      required
                    />
                  </div>

                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full appearance-none rounded-xl border border-white/20 bg-white/10 px-4 py-4 text-sm text-white backdrop-blur-md transition placeholder:text-white/60 focus:border-cyan-300/70 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-200/30 sm:rounded-2xl sm:px-5 sm:py-[1.125rem] sm:text-base lg:py-4"
                      placeholder="Mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/55 transition hover:text-white focus:outline-none sm:pr-4"
                      tabIndex="-1"
                    >
                      {showPassword ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 sm:gap-3 sm:pt-4 lg:pt-1">
                    <label className="group flex min-w-0 cursor-pointer items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="h-4 w-4 rounded border-white/30 bg-white/10 text-cyan-400 focus:ring-cyan-300"
                      />
                      <span className="whitespace-nowrap text-xs text-white/75 transition-colors group-hover:text-white">
                        Rester connecté
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="shrink-0 text-right text-xs font-semibold text-cyan-100 transition-colors hover:text-white"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-cyan-950/40 transition duration-200 hover:from-cyan-400 hover:to-blue-500 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98] sm:rounded-2xl sm:py-4 lg:py-3"
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        <span>Connexion en cours...</span>
                      </>
                    ) : (
                      <span>Se connecter</span>
                    )}
                  </button>
                </form>

                <div className="mt-9 border-t border-white/10 pt-5 text-center sm:mt-10 sm:pt-6 lg:mt-6 lg:pt-4">
                  <p className="text-[10px] font-medium tracking-wide text-white/55 sm:text-[11px]">
                    © 2026 MESUPRES - Tous droits réservés
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }

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
