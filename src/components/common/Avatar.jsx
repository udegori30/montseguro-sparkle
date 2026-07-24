import { getInitials } from "../../utils/format.js";
import { useConsultantPhotoUpload } from "../../context/ConsultantPhotosContext.jsx";
import "./Avatar.css";

// Avatar circular com fallback automatico para iniciais quando nao ha foto.
// Quando `consultantId` e informado, exibe um botao de anexar foto que
// sobrescreve `src` com o arquivo escolhido (persistido via ConsultantPhotosContext).
export function Avatar({ consultantId, name, src, size = "md" }) {
  const { photoUrl, inputRef, openPicker, handleFileChange } = useConsultantPhotoUpload(
    consultantId,
    src,
  );

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
            onClick={openPicker}
            title="Adicionar foto"
            aria-label="Adicionar foto"
          >
            📷
          </button>
          <input
            ref={inputRef}
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
