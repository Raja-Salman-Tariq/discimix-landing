import { useCallback, useLayoutEffect, useRef, useState } from "react";

const SLIDES = [
  { id: "flyer-1", label: "Event flyer placeholder 1" },
  { id: "flyer-2", label: "Event flyer placeholder 2" },
  { id: "flyer-3", label: "Event flyer placeholder 3" },
  { id: "flyer-4", label: "Event flyer placeholder 4" },
];

export default function EventsCarousel() {
  const [index, setIndex] = useState(1);
  const n = SLIDES.length;
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [tx, setTx] = useState(0);
  const [motionOk, setMotionOk] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const recompute = useCallback(() => {
    const vp = viewportRef.current;
    const tr = trackRef.current;
    if (!vp || !tr) return;
    const items = tr.querySelectorAll(".eventsCarousel-slideItem");
    if (items.length < 2) return;
    const first = items[0];
    const second = items[1];
    const w = first.getBoundingClientRect().width;
    const gap =
      second.getBoundingClientRect().left -
      first.getBoundingClientRect().left -
      w;
    const vw = vp.getBoundingClientRect().width;
    setTx(vw / 2 - w / 2 - index * (w + gap));
  }, [index]);

  useLayoutEffect(() => {
    recompute();
    const vp = viewportRef.current;
    const ro = new ResizeObserver(() => recompute());
    if (vp) ro.observe(vp);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [recompute]);

  useLayoutEffect(() => {
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(rm);
    if (rm) {
      setMotionOk(true);
      return undefined;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setMotionOk(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + n) % n);
    },
    [n]
  );

  const onRegionKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const trackStyle = {
    transform: `translate3d(${tx}px, 0, 0)`,
    transition:
      motionOk && !reducedMotion
        ? "transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)"
        : "none",
  };

  return (
    <div className="eventsCarousel">
      <div
        className="eventsCarousel-region"
        role="region"
        aria-roledescription="carousel"
        aria-label="Event flyers"
        tabIndex={0}
        onKeyDown={onRegionKeyDown}
      >
        <button
          type="button"
          className="eventsCarousel-nav eventsCarousel-nav--prev"
          onClick={() => go(-1)}
          aria-label="Previous flyer"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <div ref={viewportRef} className="eventsCarousel-viewport">
          <ul ref={trackRef} className="eventsCarousel-track" style={trackStyle}>
            {SLIDES.map((slide, i) => (
              <li
                key={slide.id}
                className={`eventsCarousel-slideItem${i === index ? " is-selected" : ""}`}
                aria-current={i === index ? "true" : undefined}
                aria-hidden={i !== index}
                aria-label={slide.label}
              >
                <div
                  className="eventsFlyerPlaceholder"
                  data-variant={String((i % 4) + 1)}
                >
                  <span className="eventsFlyerPlaceholder-brand">
                    Discimix
                  </span>
                  <span className="eventsFlyerPlaceholder-title">
                    Event flyer
                  </span>
                  <span className="eventsFlyerPlaceholder-sub">
                    Placeholder — replace with final artwork
                  </span>
                  <span className="eventsFlyerPlaceholder-meta">
                    Date &amp; venue TBA
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          className="eventsCarousel-nav eventsCarousel-nav--next"
          onClick={() => go(1)}
          aria-label="Next flyer"
        >
          <span aria-hidden="true">›</span>
        </button>
      </div>

      <div className="eventsCarousel-dots" role="tablist" aria-label="Choose flyer">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            role="tab"
            aria-selected={i === index}
            aria-label={`Show flyer ${i + 1}`}
            className={`eventsCarousel-dot${i === index ? " is-active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
