import { useEffect, useState } from "react";

/** Replace copy anytime — each item is [line1, line2]. */
export const CONTACT_BLURB_PAIRS = [
  [
    "Turn performance data into confident decisions.",
    "We combine analytics, strategy, and hands-on training for your team.",
  ],
  [
    "From KPI clarity to skills that stick.",
    "Workshops and consulting tailored to how you actually work.",
  ],
  [
    "Tell us what you are building — we will meet you there.",
    "Expect a thoughtful reply and clear next steps within one business day.",
  ],
];

const INTERVAL_MS = 5500;
const FADE_MS = 480;

export default function ContactRotatingBlurb() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let intervalId;
    let timeoutId;

    const cycle = () => {
      setVisible(false);
      timeoutId = window.setTimeout(() => {
        setIndex((i) => (i + 1) % CONTACT_BLURB_PAIRS.length);
        setVisible(true);
      }, FADE_MS);
    };

    intervalId = window.setInterval(cycle, INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  const [line1, line2] = CONTACT_BLURB_PAIRS[index];

  return (
    <div
      className={`contactRotatingBlurb${visible ? " contactRotatingBlurb--visible" : ""}`}
      aria-live="polite"
    >
      <p className="contactRotatingBlurb-line1">{line1}</p>
      <p className="contactRotatingBlurb-line2">{line2}</p>
    </div>
  );
}
