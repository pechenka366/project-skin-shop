import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import styles from "./Breadcrumbs.module.scss";

function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const getBreadcrumbName = (path: string): string => {
    const names: Record<string, string> = {
      "": "Главная",
      catalog: "Каталог",
      product: "Товар",
      admin: "Админ панель",
      products: "Управление товарами",
      users: "Пользователи",
      profile: "Профиль",
      "auth-success": "Авторизация",
    };
    return names[path] || path;
  };

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <Link to="/" className={styles.link}>
        <Home size={16} />
        <span>Главная</span>
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const displayName = getBreadcrumbName(name);
        
        if (name === "product" && !isLast) {
          return null;
        }

        return (
          <div key={routeTo} className={styles.segment}>
            <ChevronRight size={14} className={styles.separator} />
            {isLast ? (
              <span className={styles.current}>{displayName}</span>
            ) : (
              <Link to={routeTo} className={styles.link}>
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;