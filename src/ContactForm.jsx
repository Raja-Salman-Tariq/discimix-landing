import { useRef, useState } from "react";

const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

export default function ContactForm() {
  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [feedbackKind, setFeedbackKind] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    if (!accessKey) {
      setFeedbackKind("error");
      setFeedback(
        "Contact form is not configured (missing access key). Add VITE_WEB3FORMS_ACCESS_KEY to your environment."
      );
      return;
    }

    setSending(true);
    setFeedback(null);
    setFeedbackKind(null);

    const formData = new FormData(form);
    formData.append("access_key", accessKey);

    try {
      const response = await fetch(WEB3FORMS_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        setFeedbackKind("success");
        setFeedback("Success! Your message has been sent.");
        form.reset();
      } else {
        setFeedbackKind("error");
        setFeedback(
          typeof data.message === "string" ? data.message : "Something went wrong."
        );
      }
    } catch {
      setFeedbackKind("error");
      setFeedback("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      ref={formRef}
      className="contactForm"
      onSubmit={onSubmit}
      aria-describedby={feedback ? "contact-form-feedback" : undefined}
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
      {feedback ? (
        <p
          id="contact-form-feedback"
          className={`contactForm-feedback contactForm-feedback--${feedbackKind}`}
          role="status"
        >
          {feedback}
        </p>
      ) : null}
    </form>
  );
}
