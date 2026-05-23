import { Outlet, Link } from "react-router-dom";
import styles from "./Admin.module.scss";

function AdminLayout() {
  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <h2>Админ панель</h2>
        <nav>
          <Link to="/admin/products">Товары</Link>
          <Link to="/admin/users">Пользователи</Link>
          <Link to="/admin/orders">Заказы</Link>
          <Link to="/admin/categories">Категории</Link>
        </nav>
      </aside>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
