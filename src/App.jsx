import { useEffect, useRef, useState } from "react";
import HeroCanvas from "./HeroCanvas.jsx";
import EventsCarousel from "./EventsCarousel.jsx";
import ContactRotatingBlurb from "./ContactRotatingBlurb.jsx";
import ContactForm from "./ContactForm.jsx";

const LINKS = [
  ["About", "#about"],
  ["Services", "#services"],
  ["Events", "#events"],
  ["Contact", "#contact"],
];

const SERVICE_WORKSHOP_CHIPS = [
  "UI/UX Design",
  "AI Prompt Engineering",
  "Python Programming",
  "Coding with AI Tools",
  "Stakeholder Communication",
  "English Proficiency",
];

/** Share of the about section’s height that intersects the viewport (0–1). */
function aboutInViewRatio(el) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight;
  const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  if (visible <= 0 || r.height <= 0) return 0;
  return visible / r.height;
}

/** True when the hero covers most of the viewport (user is effectively “on” hero). */
function heroDominatesViewport(hero) {
  if (!hero) return false;
  const r = hero.getBoundingClientRect();
  const vh = window.innerHeight;
  const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
  if (visible <= 0) return false;
  return visible / vh > 0.52;
}

export default function App() {
  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const navUnlockedRef = useRef(false);
  const [navOn, setNavOn] = useState(false);

  useEffect(() => {
    const tick = () => {
      const about = aboutRef.current;
      const hero = heroRef.current;
      if (about && aboutInViewRatio(about) >= 0.5) {
        navUnlockedRef.current = true;
      }
      setNavOn(navUnlockedRef.current && !heroDominatesViewport(hero));
    };
    tick();
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", tick);
    return () => {
      window.removeEventListener("scroll", tick);
      window.removeEventListener("resize", tick);
    };
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
          <div className="hero-copy">
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
          </div>
        </section>

        <div className="section-seam" aria-hidden="true">
          <svg
            className="section-seam-svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 48"
            preserveAspectRatio="none"
            focusable="false"
          >
            <defs>
              <pattern
                id="sectionSeamMesh"
                width="200"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <rect width="200" height="48" fill="#070510" />
                <path
                  d="M0 14h50l25 14h50l25-14h50"
                  fill="none"
                  stroke="rgba(167,139,250,0.36)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M0 32l40-12 40 12 40-12 40 12 40-12"
                  fill="none"
                  stroke="rgba(124,58,237,0.26)"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M25 14v18M75 14v18M125 14v18M175 14v18"
                  fill="none"
                  stroke="rgba(167,139,250,0.18)"
                  strokeWidth="0.7"
                />
                <circle cx="50" cy="14" r="2.2" fill="rgba(196,181,253,0.55)" />
                <circle cx="100" cy="28" r="2" fill="rgba(167,139,250,0.42)" />
                <circle cx="150" cy="14" r="2.2" fill="rgba(196,181,253,0.55)" />
              </pattern>
            </defs>
            <rect width="1200" height="48" fill="url(#sectionSeamMesh)" />
            <line
              x1="0"
              y1="0.5"
              x2="1200"
              y2="0.5"
              stroke="rgba(167,139,250,0.32)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <line
              x1="0"
              y1="47.5"
              x2="1200"
              y2="47.5"
              stroke="rgba(124,58,237,0.22)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        <section
          ref={aboutRef}
          id="about"
          className="section section--about"
          aria-labelledby="about-heading"
        >
          <div className="about-inner">
            <h2 id="about-heading" className="section-title section-title--about">
              About Us
            </h2>
            <div className="about-body">
              <p>
                Discimix Solutions is a specialized business consultancy firm focused
                on empowering small businesses and digital entrepreneurs to achieve
                measurable growth through data-driven decision-making. As a
                performance-oriented consultancy, we operate at the intersection of
                analytics, strategy, and communication—helping brands translate their
                online presence into tangible business outcomes.
              </p>
              <p>
                Our core expertise lies in KPI (Key Performance Indicator) and ROI
                (Return on Investment) analysis, particularly for small businesses and
                Instagram-based ventures. We understand that many growing brands struggle
                to interpret performance metrics effectively. Our dedicated team conducts
                in-depth evaluations of your social media platforms. We identify
                inefficiencies, uncover growth opportunities, and provide clear,
                actionable recommendations to optimize both content strategy and audience
                engagement.
              </p>
              <p>
                Beyond consultancy, Discimix Solutions is also a professional training
                and capability-building organization. Our team delivers personalized
                workshops designed to equip individuals and teams with in-demand,
                future-focused skills. These include:
              </p>
              <ul className="about-list">
                <li>Python Programming</li>
                <li>Coding with AI Tools</li>
                <li>Corpus &amp; Language Analysis Tools</li>
                <li>Stakeholder Communication Skills</li>
                <li>English Proficiency Development</li>
                <li>UI/UX Design Principles</li>
                <li>AI Prompt Engineering</li>
              </ul>
              <p>
                Each workshop is tailored to the participant&apos;s level and objectives,
                ensuring practical learning outcomes that can be immediately applied in
                real-world scenarios.
              </p>
              <p>
                At its core, Discimix is a hybrid consultancy and professional development
                firm—bridging analytical insight with skill enhancement. We are committed
                to helping our clients not only understand their performance metrics but
                also build the competencies required to sustain long-term success in an
                increasingly digital and competitive landscape.
              </p>
            </div>
          </div>
        </section>

        <section
          id="services"
          className="section section--services"
          aria-labelledby="services-heading"
        >
          <h2 id="services-heading" className="section-title section-title--services">
            Services
          </h2>
          <p className="services-lede">
            Strategy, analytics, and training built for teams that want clarity and
            momentum.
          </p>
          <div className="servicesRow">
            <article className="serviceCard">
              <div className="serviceCard-iconWrap" aria-hidden="true">
                <svg
                  className="serviceCard-iconSvg"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5v14M8 15l4 4 4-4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h3 className="serviceCard-title">Consultancy &amp; Analytics</h3>
              <p className="serviceCard-body">
                In-depth KPI/ROI analysis, Instagram performance audits, content
                strategy optimization, and clear actionable growth recommendations for
                small businesses and digital entrepreneurs.
              </p>
              <div className="serviceCard-line" aria-hidden="true" />
            </article>
            <article className="serviceCard">
              <div className="serviceCard-iconWrap" aria-hidden="true">
                <svg
                  className="serviceCard-iconSvg serviceCard-iconSvg--fill"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27z" />
                </svg>
              </div>
              <h3 className="serviceCard-title">Workshops &amp; Training</h3>
              <p className="serviceCard-body">
                Personalized skill-building sessions tailored to each participant&apos;s
                level and objectives, ensuring practical learning outcomes immediately
                applicable in real-world scenarios.
              </p>
              <p className="visually-hidden" id="services-workshop-topics">
                Workshop topics include{" "}
                {SERVICE_WORKSHOP_CHIPS.join(", ")}.
              </p>
              <div className="serviceCard-tickerMask" aria-hidden="true">
                <div className="serviceCard-ticker">
                  {[0, 1].map((dup) => (
                    <div key={dup} className="serviceCard-tickerGroup">
                      {SERVICE_WORKSHOP_CHIPS.map((label) => (
                        <span key={`${dup}-${label}`} className="serviceCard-chip">
                          {label}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>

        <section
          id="events"
          className="section section--events"
          aria-labelledby="events-heading"
        >
          <h2 id="events-heading" className="section-title">
            Events
          </h2>
          <p className="events-intro scaffold">
            Upcoming workshops and sessions — flyer artwork coming soon.
          </p>
          <EventsCarousel />
        </section>

        <section
          id="contact"
          className="section section--contact"
          aria-labelledby="contact-heading"
        >
          <div className="contactHeader">
            <h2 id="contact-heading" className="section-title">
              Contact Us
            </h2>
            <p className="scaffold section--contact-lede">
              We’ll get back to you shortly.
            </p>
          </div>

          <div className="contactSplit">
            <div className="contactBlurbCol">
              <ContactRotatingBlurb />
            </div>
            <div className="contactFormCol">
              <div className="contactPanelOuter">
                <div className="contactPanel">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
