import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Profile.module.scss";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Добавленные состояния для установки пароля
  const [userHasPassword, setUserHasPassword] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const API_URL =
    window.location.hostname === "localhost"
      ? "http://localhost:5000"
      : "https://bahtarma.ru";

  // Проверка наличия пароля у пользователя
  const checkUserHasPassword = async (userId: string) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/users/${userId}/has-password`,
      );
      setUserHasPassword(response.data.hasPassword);
    } catch (error) {
      console.error("Ошибка проверки пароля:", error);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      navigate("/");
      return;
    }

    const userData = JSON.parse(savedUser);
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    // Проверяем, есть ли у пользователя пароль
    checkUserHasPassword(userData._id);

    setLoading(false);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await axios.put(`${API_URL}/api/users/${user?._id}`, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      console.log("Ответ сервера:", response.data);
      const updatedUser: User = {
        _id: user!._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: user?.avatar,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMessage({ text: "Профиль успешно обновлён!", type: "success" });
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Ошибка обновления",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ text: "Новые пароли не совпадают", type: "error" });
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        text: "Пароль должен быть не менее 6 символов",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await axios.put(`${API_URL}/api/users/${user?._id}/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage({ text: "Пароль успешно изменён!", type: "success" });
      setFormData({
        ...formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Ошибка смены пароля",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  // Установка пароля для пользователей без пароля
  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage({ text: "Пароли не совпадают", type: "error" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        text: "Пароль должен быть не менее 6 символов",
        type: "error",
      });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      await axios.post(`${API_URL}/api/users/${user?._id}/set-password`, {
        newPassword,
      });

      setMessage({ text: "Пароль успешно установлен!", type: "success" });
      setUserHasPassword(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({
        text: err.response?.data?.message || "Ошибка установки пароля",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.profile}>
      <div className={styles.container}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          ← Назад
        </button>
        <h1>Профиль пользователя</h1>
        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        <div className={styles.profileContent}>
          <div className={styles.avatarSection}>
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={styles.avatar}
              />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className={styles.form}>
            <h2>Личные данные</h2>

            <div className={styles.formGroup}>
              <label>Имя</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Телефон</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+7 (999) 123-45-67"
              />
            </div>

            <button type="submit" className={styles.saveBtn} disabled={saving}>
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </form>

          {userHasPassword && (
            <form
              onSubmit={handleChangePassword}
              className={styles.passwordForm}
            >
              <h2>Смена пароля</h2>
              <div className={styles.formGroup}>
                <label>Текущий пароль</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Новый пароль</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Подтверждение пароля</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="submit"
                className={styles.passwordBtn}
                disabled={saving}
              >
                {saving ? "Сохранение..." : "Сменить пароль"}
              </button>
            </form>
          )}

          {!userHasPassword && (
            <div className={styles.setPasswordSection}>
              <h2>Установить пароль</h2>
              <p className={styles.info}>
                Вы вошли через соцсеть. Установите пароль, чтобы иметь
                возможность входить по email/паролю.
              </p>
              <form
                onSubmit={handleSetPassword}
                className={styles.passwordForm}
              >
                <div className={styles.formGroup}>
                  <label>Новый пароль</label>
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Подтверждение пароля</label>
                  <input
                    type="password"
                    placeholder="Подтверждение пароля"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={styles.setPasswordBtn}
                  disabled={saving}
                >
                  {saving ? "Сохранение..." : "Установить пароль"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
