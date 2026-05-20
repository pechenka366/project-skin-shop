import { useState } from "react";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { FaYandex } from "react-icons/fa";
import styles from "./AuthModal.module.scss";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  }) => void;
}

function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // const API_URL = 'https://bahtarma.ru';
  const API_URL = "http://localhost:5000";

  const handleSwitchMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!isLogin && !validateEmail(email)) {
      setError("Введите корректный email (пример: name@mail.ru)");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const response = await axios.post(`${API_URL}/api/login`, {
          email,
          password,
        });

        onLogin({
          _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          avatar: response.data.user.avatar || "",
        });
        onClose();
      } else {
        const response = await axios.post(`${API_URL}/api/register`, {
          name,
          email,
          password,
        });

        onLogin({
          _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
        });
        onClose();
      }

      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `${API_URL}/auth/${provider}`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ×
        </button>

        <div className={styles.cardContainer}>
          <div className={`${styles.card} ${!isLogin ? styles.flipped : ""}`}>
            <div className={styles.cardFront}>
              <h2>Вход</h2>
              {error && <div className={styles.error}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Загрузка..." : "Войти"}
                </button>
              </form>

              <div className={styles.divider}>
                <span>или</span>
              </div>

              <div className={styles.socialButtons}>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className={styles.socialBtn}
                  aria-label="Войти через Google"
                >
                  <FcGoogle size={28} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("yandex")}
                  className={styles.socialBtn}
                  aria-label="Войти через Яндекс"
                >
                  <FaYandex size={24} color="#FC3F1D" />
                </button>

                {/* <button
                  type="button"
                  onClick={() => handleSocialLogin("vk")}
                  className={styles.socialBtn}
                  aria-label="Войти через ВКонтакте"
                >
                  <FaVk size={24} color="#0077FF" />
                </button> */}
              </div>

              <p className={styles.switchText}>
                Нет аккаунта?
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={handleSwitchMode}
                >
                  Зарегистрироваться
                </button>
              </p>
            </div>

            <div className={styles.cardBack}>
              <h2>Регистрация</h2>
              {error && <div className={styles.error}>{error}</div>}
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? "Загрузка..." : "Зарегистрироваться"}
                </button>
              </form>

              <div className={styles.divider}>
                <span>или</span>
              </div>

              <div className={styles.socialButtons}>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className={styles.socialBtn}
                  aria-label="Зарегистрироваться через Google"
                >
                  <FcGoogle size={28} />
                </button>

                <button
                  type="button"
                  onClick={() => handleSocialLogin("yandex")}
                  className={styles.socialBtn}
                  aria-label="Зарегистрироваться через Яндекс"
                >
                  <FaYandex size={24} color="#FC3F1D" />
                </button>

                {/* <button
                  type="button"
                  onClick={() => handleSocialLogin("vk")}
                  className={styles.socialBtn}
                  aria-label="Зарегистрироваться через ВКонтакте"
                >
                  <FaVk size={24} color="#0077FF" />
                </button> */}
              </div>

              <p className={styles.switchText}>
                Уже есть аккаунт?
                <button
                  type="button"
                  className={styles.switchBtn}
                  onClick={handleSwitchMode}
                >
                  Войти
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
