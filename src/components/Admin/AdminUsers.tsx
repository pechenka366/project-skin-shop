import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Admin.module.scss';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  avatar?: string;
}

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
  });

  const API_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://bahtarma.ru';
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/users`, {
        params: { userId: user._id }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/api/admin/users/${editingUser?._id}`,
        { ...formData, userId: user._id, phone: formData.phone}
      );
      loadUsers();
      setEditingUser(null);
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Удалить пользователя?')) {
      try {
        await axios.delete(`${API_URL}/api/admin/users/${id}`, {
          params: { userId: user._id }
        });
        loadUsers();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className={styles.adminUsers}>
      <h1>Управление пользователями</h1>

      {editingUser && (
        <form onSubmit={handleUpdate} className={styles.editForm}>
          <h2>Редактировать {editingUser.name}</h2>
          <input
            type="text"
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Телефон"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
          <div className={styles.editButtons}>
            <button type="submit">Сохранить</button>
            <button type="button" onClick={() => setEditingUser(null)}>Отмена</button>
          </div>
        </form>
      )}

      <div className={styles.usersList}>
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '—'}</td>
                <td>
                  <span className={u.role === 'admin' ? styles.adminBadge : styles.userBadge}>
                    {u.role === 'admin' ? 'Админ' : 'Пользователь'}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(u)} className={styles.editBtn}>✏️</button>
                  <button onClick={() => handleDelete(u._id)} className={styles.deleteBtn}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminUsers;