import { getInitials } from "../../utils/format.js";
import "./Avatar.css";

// Avatar circular com fallback automatico para iniciais quando nao ha `src`.
export function Avatar({ name, src, size = "md" }) {
  return (
    <div className={`avatar avatar--${size}`}>
      {src ? (
        <img src={src} alt={name} className="avatar__image" />
      ) : (
        <span className="avatar__initials">{getInitials(name)}</span>
      )}
    </div>
  );
}
