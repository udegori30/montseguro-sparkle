import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

export function PhotoUpload({ name }: { name: string }) {
  const key = `ms_photo_${getInitials(name)}`;
  const [src, setSrc] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setSrc(localStorage.getItem(key));
  }, [key]);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      localStorage.setItem(key, result);
      setSrc(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {src ? (
        <img
          src={src}
          alt={name}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          className="ms-display absolute inset-0 flex items-center justify-center text-6xl font-extrabold"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}
        >
          {getInitials(name)}
        </div>
      )}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, var(--ms-photo-fade) 70%, var(--ms-bg) 100%)",
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute left-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{ background: "rgba(13,27,42,0.75)", border: "1px solid rgba(255,255,255,0.2)" }}
        aria-label="Upload photo"
      >
        <Camera size={14} color="#E2EDF7" />
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFile}
      />
    </>
  );
}