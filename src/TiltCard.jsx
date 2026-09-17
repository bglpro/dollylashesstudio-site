import { useRef } from "react";
import { C, alpha, EASE } from "./theme";
import { TransitionLink } from "./PageTransition";
import { isInternal } from "./navigation";

const ArrowUpRight = ({ className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const TILT_CSS = `
.tilt-card { transition: transform 250ms cubic-bezier(0.22,1,0.36,1); transform-style: preserve-3d; }
@media (prefers-reduced-motion: reduce) {
  .tilt-card { transition: none !important; transform: none !important; }
}
@media (hover: none) {
  /* pas de survol au doigt : la carte reste à plat */
  .tilt-card { transform: none !important; }
}`;

const MAX_TILT = 9; // degrés

export function TiltCardStyles() {
  return <style>{TILT_CSS}</style>;
}

export default function TiltCard({
  title,
  subtitle,
  imageUrl,
  href,
  actionText = "Découvrir",
  height = "17rem",
}) {
  const cardRef = useRef(null);

  const onMouseMove = (event) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    // écrit directement dans le DOM : pas de rendu React par frame
    el.style.transform = `perspective(1000px) rotateX(${(-y * MAX_TILT).toFixed(
      2
    )}deg) rotateY(${(x * MAX_TILT).toFixed(2)}deg)`;
  };

  const reset = () => {
    const el = cardRef.current;
    if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  };

  const internal = isInternal(href);
  const Wrapper = internal ? TransitionLink : "a";
  const linkProps = internal
    ? { to: href }
    : { href, target: "_blank", rel: "noopener noreferrer" };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      className="tilt-card relative w-full overflow-hidden rounded-2xl shadow-lg"
      style={{ height }}
    >
      <img
        src={imageUrl}
        alt=""
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover brightness-45"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            `linear-gradient(to bottom, ${alpha(C.ink, 0.25)} 0%, ${alpha(C.ink, 0.05)} 40%, ${alpha(C.ink, 0.8)} 100%)`,
        }}
      />

      <div
        className="relative flex h-full flex-col justify-between p-4 text-white"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-semibold leading-tight">{title}</p>
            {subtitle ? (
              <p className="mt-0.5 text-sm font-light text-white/80">{subtitle}</p>
            ) : null}
          </div>
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-1 ring-inset ring-white/30"
            style={{ backgroundColor: alpha(C.surface, 0.2), backdropFilter: "blur(6px)" }}
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>

        <Wrapper
          {...linkProps}
          className="w-full rounded-lg py-3 text-center text-sm font-semibold text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white motion-reduce:transition-none"
          style={{ backgroundColor: alpha(C.surface, 0.12), backdropFilter: "blur(8px)" }}
        >
          {actionText}
        </Wrapper>
      </div>
    </div>
  );
}
