import { useEffect, useRef, useState } from "react";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export default function ContactForm() {
  const formRef = useRef(null);
  const successTitleRef = useRef(null);
  const [success, setSuccess] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (success && successTitleRef.current) {
      successTitleRef.current.focus();
    }
  }, [success]);

  async function onSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!accessKey) {
      setError(
        "Contact form is not configured (missing access key). Add VITE_WEB3FORMS_ACCESS_KEY to your environment."
      );
      return;
    }

    setSending(true);
    setError(null);

    const formData = new FormData(form);
    formData.append("access_key", accessKey);

    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        form.reset();
        setSuccess(true);
      } else {
        setError(
          typeof data.message === "string" ? data.message : "Something went wrong."
        );
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function sendAnother() {
    setSuccess(false);
    setError(null);
  }

  if (success) {
    return (
      <div
        className="contactFormSuccess"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="contactFormSuccess-mark" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path
              d="M14 24.5l7 7 13-13"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3
          ref={successTitleRef}
          tabIndex={-1}
          className="contactFormSuccess-title"
        >
          Message sent
        </h3>
        <p className="contactFormSuccess-lede">
          Thank you — we received your note and will get back to you shortly.
        </p>
        <button
          type="button"
          className="cta cta--block cta--panel"
          onClick={sendAnother}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="contactForm"
      onSubmit={onSubmit}
      aria-describedby={error ? "contact-form-error" : undefined}
    >
      <label>
        Name
        <input name="name" autoComplete="name" required disabled={sending} />
      </label>
      <label>
        Email
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          disabled={sending}
        />
      </label>
      <label>
        Message
        <textarea name="message" rows={4} required disabled={sending} />
      </label>
      <button
        type="submit"
        className="cta cta--block cta--panel"
        disabled={sending}
        aria-busy={sending}
      >
        {sending ? "Sending…" : "Send message"}
      </button>
      {error ? (
        <p
          id="contact-form-error"
          className="contactForm-feedback contactForm-feedback--error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
