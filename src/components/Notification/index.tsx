import { useEffect, useState } from "react";
import styles from "./Notification.module.scss";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

function Notification({ message, type, duration = 3000, onClose }: NotificationProps) {
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setIsHiding(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div className={`${styles.notification} ${styles[type]} ${isHiding ? styles.hiding : ""}`}>
      <div className={styles.content}>
        <span className={styles.icon}>
          {type === "success" && "✓"}
          {type === "error" && "✗"}
          {type === "info" && "ℹ"}
        </span>
        <span className={styles.message}>{message}</span>
      </div>
      <button className={styles.closeBtn} onClick={() => {
        setIsHiding(true);
        setTimeout(onClose, 300);
      }}>×</button>
      <div className={styles.progressBar} style={{ animationDuration: `${duration}ms` }} />
    </div>
  );
}

export default Notification;