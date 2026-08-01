/**
 * Asia Green Tech — app bootstrap
 */

document.addEventListener("DOMContentLoaded", async () => {
  if (window.AGT_THEME) {
    window.AGT_THEME.initTheme();
  }

  if (window.AGT_I18N) {
    await window.AGT_I18N.initI18n();
  }

  const syncThemeLabel = () => {
    const label = document.querySelector("[data-i18n='theme.toggle']");
    if (label && window.t) {
      label.textContent = window.t("theme.toggle");
    }
  };

  document.addEventListener("i18n:changed", syncThemeLabel);
  document.addEventListener("theme:changed", syncThemeLabel);

  initScrollReveal();
  initContactForm();
});

function initScrollReveal() {
  const nodes = document.querySelectorAll(".scroll-reveal");
  if (!nodes.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    nodes.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );

  nodes.forEach((el) => observer.observe(el));
}

function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("contact-status");
  if (!(form instanceof HTMLFormElement) || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = /** @type {HTMLInputElement} */ (form.elements.namedItem("name"));
    const email = /** @type {HTMLInputElement} */ (form.elements.namedItem("email"));
    const message = /** @type {HTMLTextAreaElement} */ (
      form.elements.namedItem("message")
    );

    const nameValue = name?.value.trim() || "";
    const emailValue = email?.value.trim() || "";
    const messageValue = message?.value.trim() || "";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    status.hidden = false;
    status.classList.remove("is-success", "is-error");

    if (!nameValue || !emailOk || !messageValue) {
      status.classList.add("is-error");
      status.textContent = window.t
        ? window.t("contact.error")
        : "Please complete all fields with a valid email address.";
      return;
    }

    const subject = encodeURIComponent(`Asia Green Tech — ${nameValue}`);
    const body = encodeURIComponent(
      `${messageValue}\n\n—\n${nameValue}\n${emailValue}`
    );
    window.location.href = `mailto:hello@asiagreentech.com?subject=${subject}&body=${body}`;

    status.classList.add("is-success");
    status.textContent = window.t
      ? window.t("contact.success")
      : "Thank you — your message is ready to send. We will be in touch shortly.";
    form.reset();
  });

  document.addEventListener("i18n:changed", () => {
    if (status.hidden) return;
    if (status.classList.contains("is-success") && window.t) {
      status.textContent = window.t("contact.success");
    }
    if (status.classList.contains("is-error") && window.t) {
      status.textContent = window.t("contact.error");
    }
  });
}
