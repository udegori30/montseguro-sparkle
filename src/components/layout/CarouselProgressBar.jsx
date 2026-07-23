import "./CarouselProgressBar.css";

// Barra fina logo abaixo do TabNav indicando o tempo restante ate o
// carrossel avancar sozinho para a proxima aba.
export function CarouselProgressBar({ progress }) {
  return (
    <div
      className="carousel-progress"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="carousel-progress__fill" style={{ width: `${progress}%` }} />
    </div>
  );
}
