import { useCallback, useState } from "react";

const SLIDES = [
  { id: "flyer-1", label: "Event flyer placeholder 1" },
  { id: "flyer-2", label: "Event flyer placeholder 2" },
  { id: "flyer-3", label: "Event flyer placeholder 3" },
  { id: "flyer-4", label: "Event flyer placeholder 4" },
];

export default function EventsCarousel() {
  const [index, setIndex] = useState(0);
  const n = SLIDES.length;

  const go = useCallback(
    (delta) => {
      setIndex((i) => (i + delta + n) % n);
    },
    [n]
  );

  const left = (index - 1 + n) % n;
  const center = index;
  const right = (index + 1) % n;
  const trio = [
    { slideIndex: left, role: "side", key: "left" },
    { slideIndex: center, role: "center", key: "center" },
    { slideIndex: right, role: "side", key: "right" },
  ];

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

        <div className="eventsCarousel-viewport">
          <ul className="eventsCarousel-strip">
            {trio.map(({ slideIndex, role, key }) => {
              const i = slideIndex;
              return (
                <li
                  key={key}
                  className={`eventsCarousel-cell eventsCarousel-cell--${role}`}
                  aria-current={role === "center" ? "true" : undefined}
                  aria-label={SLIDES[i].label}
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
              );
            })}
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
