import { useEffect, useRef, useState } from "react";
import HeroCanvas from "./HeroCanvas.jsx";

const LINKS = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Events", "#events"],
  ["Contact", "#contact"],
];

export default function App() {
  const heroRef = useRef(null);
  const [navOn, setNavOn] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    const tick = () =>
      setNavOn(!!el && window.scrollY > el.offsetHeight - 40);
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    return () => window.removeEventListener("scroll", tick);
  }, []);

  return (
    <>
      <header className={`glassNav${navOn ? " glassNav--on" : ""}`}>
        <a className="glassNav-brand" href="#hero">
          Discimix
        </a>
        <nav className="glassNav-links" aria-label="Sections">
          {LINKS.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main>
        <section
          ref={heroRef}
          id="hero"
          className="section section--hero"
          aria-label="Hero"
        >
          <HeroCanvas />
          <h1 className="brand-title">DISCIMIX</h1>
          <p className="hero-pre">Transform Your Business With Premium</p>
          <p className="hero-accent">AI Intelligence &amp; Data Insights</p>
          <p className="lede">
            Cutting-edge solutions designed for enterprises that demand excellence.
            Harness the power of artificial intelligence and strategic consulting
            to accelerate growth and innovation.
          </p>
          <a className="cta" href="#contact">
            Get started
          </a>
        </section>

        <section id="about" className="section" aria-labelledby="about-heading">
          <h2 id="about-heading" className="section-title">
            About
          </h2>
          <p className="scaffold">Studio story — TBD.</p>
        </section>

        <section id="services" className="section" aria-labelledby="services-heading">
          <h2 id="services-heading" className="section-title">
            Services
          </h2>
          <p className="scaffold">Offerings — TBD.</p>
        </section>

        <section id="events" className="section" aria-labelledby="events-heading">
          <h2 id="events-heading" className="section-title">
            Events
          </h2>
          <p className="scaffold">Dates & venues — TBD.</p>
        </section>

        <section
          id="contact"
          className="section section--contact"
          aria-labelledby="contact-heading"
        >
          <h2 id="contact-heading" className="section-title">
            Contact
          </h2>
          <p className="scaffold">We’ll get back to you shortly.</p>
          <form
            className="contactForm"
            onSubmit={(e) => e.preventDefault()}
          >
            <label>
              Name
              <input name="name" autoComplete="name" required />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
              />
            </label>
            <label>
              Message
              <textarea name="message" rows={4} required />
            </label>
            <button type="submit" className="cta cta--block">
              Send message
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
