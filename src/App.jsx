import { useEffect, useRef, useState } from "react";

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
          <p className="eyebrow">Discimix</p>
          <h1 className="headline">Clarity, distilled.</h1>
          <p className="lede">A focused product experience. More soon.</p>
          <a className="cta" href="#contact">
            Get in touch
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
