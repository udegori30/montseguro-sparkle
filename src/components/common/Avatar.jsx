import { useRef } from "react";
import { getInitials } from "../../utils/format.js";
import { useConsultantPhotos } from "../../context/ConsultantPhotosContext.jsx";
import "./Avatar.css";

// Avatar circular com fallback automatico para iniciais quando nao ha foto.
// Quando `consultantId` e informado, exibe um botao de anexar foto que
// sobrescreve `src` com o arquivo escolhido (persistido via ConsultantPhotosContext).
export function Avatar({ consultantId, name, src, size = "md" }) {
  const { photos, setPhoto } = useConsultantPhotos();
  const fileInputRef = useRef(null);
  const photoUrl = (consultantId ? photos[consultantId] : undefined) ?? src;

  function handlePick(event) {
    event.stopPropagation();
    fileInputRef.current?.click();
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !consultantId) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(consultantId, reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className="avatar-wrap">
      <div className={`avatar avatar--${size}`}>
        {photoUrl ? (
          <img src={photoUrl} alt={name} className="avatar__image" />
        ) : (
          <span className="avatar__initials">{getInitials(name)}</span>
        )}
      </div>
      {consultantId && (
        <>
          <button
            type="button"
            className="avatar__edit-btn"
            onClick={handlePick}
            title="Adicionar foto"
            aria-label="Adicionar foto"
          >
            📷
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="avatar__file-input"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
