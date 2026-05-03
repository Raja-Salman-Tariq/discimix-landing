/**
 * Elegant flowing gold accent lines behind Events content.
 */
export default function EventsAmbient() {
  return (
    <div className="eventsAmbient" aria-hidden="true">
      <svg
        className="eventsAmbient-svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <filter
            id="eventsAmbientGlow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.8" result="b" />
            <feComponentTransfer in="b" result="brightBlur">
              <feFuncA type="linear" slope="0.85" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="brightBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="eventsAmbient-trace eventsAmbient-trace--a"
          d="M -80 180 Q 280 120 480 220 T 880 180 Q 1040 160 1280 210"
          fill="none"
          stroke="rgba(255, 215, 100, 0.16)"
          strokeWidth="1.4"
          strokeLinecap="round"
          filter="url(#eventsAmbientGlow)"
        />
        <path
          className="eventsAmbient-trace eventsAmbient-trace--b"
          d="M -120 500 Q 200 420 420 520 T 780 480 Q 1000 450 1320 560"
          fill="none"
          stroke="rgba(252, 200, 85, 0.12)"
          strokeWidth="1.2"
          strokeLinecap="round"
          filter="url(#eventsAmbientGlow)"
        />
        <path
          className="eventsAmbient-trace eventsAmbient-trace--c"
          d="M 100 -40 Q 340 80 560 40 T 960 100 Q 1120 140 1300 80"
          fill="none"
          stroke="rgba(255, 228, 135, 0.09)"
          strokeWidth="1.1"
          strokeLinecap="round"
          filter="url(#eventsAmbientGlow)"
        />
      </svg>
    </div>
  );
}
