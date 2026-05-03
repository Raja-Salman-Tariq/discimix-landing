import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const SLIDES = [
  { id: "flyer-1", label: "Event flyer placeholder 1" },
  { id: "flyer-2", label: "Event flyer placeholder 2" },
  { id: "flyer-3", label: "Event flyer placeholder 3" },
  { id: "flyer-4", label: "Event flyer placeholder 4" },
  { id: "flyer-4", label: "Event flyer placeholder 5" },
  { id: "flyer-4", label: "Event flyer placeholder 6" },
  { id: "flyer-4", label: "Event flyer placeholder 7" },
  { id: "flyer-4", label: "Event flyer placeholder 8" },
  { id: "flyer-4", label: "Event flyer placeholder 9" },
];

function buildExtendedSlides(n) {
  if (n === 0) return [];
  return [
    { ...SLIDES[n - 1], reactKey: `${SLIDES[n - 1].id}--clone-prev` },
    ...SLIDES.map((s) => ({ ...s, reactKey: s.id })),
    { ...SLIDES[0], reactKey: `${SLIDES[0].id}--clone-next` },
  ];
}

/** Logical index 0..n-1 from track position 0..n+1 */
function trackToLogical(trackIndex, n) {
  if (trackIndex === 0) return n - 1;
  if (trackIndex === n + 1) return 0;
  return trackIndex - 1;
}

export default function EventsCarousel() {
  const n = SLIDES.length;
  const extended = useMemo(() => buildExtendedSlides(n), [n]);
  const [trackIndex, setTrackIndex] = useState(5);
  const [instantMove, setInstantMove] = useState(false);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const trackIndexRef = useRef(trackIndex);
  trackIndexRef.current = trackIndex;
  const rafRef = useRef(0);
  const [tx, setTx] = useState(0);
  const [motionOk, setMotionOk] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const measureAndApply = useCallback(() => {
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
    const ti = trackIndexRef.current;
    const next = vw / 2 - w / 2 - ti * (w + gap);
    setTx((prev) => (Math.abs(prev - next) < 0.5 ? prev : next));
  }, []);

  const scheduleMeasure = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      measureAndApply();
    });
  }, [measureAndApply]);

  useLayoutEffect(() => {
    measureAndApply();
  }, [trackIndex, measureAndApply]);

  useLayoutEffect(() => {
    const vp = viewportRef.current;
    const ro = new ResizeObserver(() => scheduleMeasure());
    if (vp) ro.observe(vp);
    window.addEventListener("resize", scheduleMeasure, { passive: true });
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", scheduleMeasure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scheduleMeasure]);

  useEffect(() => {
    if (!instantMove) return;
    const id = requestAnimationFrame(() => setInstantMove(false));
    return () => cancelAnimationFrame(id);
  }, [instantMove]);

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
      setTrackIndex((i) => {
        if (delta === 1) {
          if (i === n + 1) return 2;
          if (i === 0) return 1;
          if (i < n) return i + 1;
          if (i === n) return n + 1;
          return i;
        }
        if (i === 0) return n - 1;
        if (i === 1) return 0;
        if (i === n + 1) return n;
        if (i > 1) return i - 1;
        return i;
      });
    },
    [n]
  );

  const onTransitionEnd = (e) => {
    if (e.propertyName !== "transform") return;
    if (trackIndex === n + 1) {
      setInstantMove(true);
      setTrackIndex(1);
    } else if (trackIndex === 0) {
      setInstantMove(true);
      setTrackIndex(n);
    }
  };

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

  const logical = trackToLogical(trackIndex, n);
  const transitionOn =
    motionOk && !reducedMotion && !instantMove
      ? "transform 0.48s cubic-bezier(0.22, 1, 0.36, 1)"
      : "none";

  const trackStyle = {
    transform: `translate3d(${tx}px, 0, 0)`,
    transition: transitionOn,
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
          <ul
            ref={trackRef}
            className="eventsCarousel-track"
            style={trackStyle}
            onTransitionEnd={onTransitionEnd}
          >
            {extended.map((slide, i) => (
              <li
                key={slide.reactKey}
                className={`eventsCarousel-slideItem${i === trackIndex ? " is-selected" : ""}`}
                aria-current={i === trackIndex ? "true" : undefined}
                aria-hidden={i !== trackIndex}
                aria-label={slide.label}
              >
                <div
                  className="eventsFlyerPlaceholder"
                  data-variant={String((trackToLogical(i, n) % 4) + 1)}
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
            aria-selected={i === logical}
            aria-label={`Show flyer ${i + 1}`}
            className={`eventsCarousel-dot${i === logical ? " is-active" : ""}`}
            onClick={() => setTrackIndex(i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
