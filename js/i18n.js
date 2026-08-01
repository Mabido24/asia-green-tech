/**
 * Asia Green Tech — lightweight client-side i18n
 * Usage in HTML: data-i18n="home.title"
 * Usage in JS:   t('home.title')
 */

(function (global) {
  "use strict";

  const SUPPORTED_LOCALES = ["en", "fr", "de", "it", "es", "pt", "ru", "ar", "hi"];
  const RTL_LOCALES = new Set(["ar"]);
  const STORAGE_KEY = "agt-locale";
  const DEFAULT_LOCALE = "en";

  /** @type {Record<string, unknown>} */
  let dictionary = {};
  let currentLocale = DEFAULT_LOCALE;

  /**
   * Resolve nested key path (e.g. "home.title").
   * @param {string} key
   * @param {Record<string, unknown>} [dict]
   * @returns {string}
   */
  function resolveKey(key, dict) {
    const parts = String(key).split(".");
    let node = dict || dictionary;

    for (const part of parts) {
      if (node && typeof node === "object" && part in node) {
        node = /** @type {Record<string, unknown>} */ (node)[part];
      } else {
        return key;
      }
    }

    return typeof node === "string" ? node : key;
  }

  /**
   * Translate a key. Supports simple {{var}} interpolation.
   * @param {string} key
   * @param {Record<string, string|number>} [vars]
   * @returns {string}
   */
  function t(key, vars) {
    let value = resolveKey(key);

    if (vars && typeof value === "string") {
      value = value.replace(/\{\{(\w+)\}\}/g, (_, name) =>
        vars[name] !== undefined ? String(vars[name]) : `{{${name}}}`
      );
    }

    return value;
  }

  /**
   * Apply translations to all [data-i18n] nodes and i18n attributes.
   */
  function applyTranslations() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      el.textContent = t(key);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      el.setAttribute("placeholder", t(key));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      el.setAttribute("aria-label", t(key));
    });

    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      el.setAttribute("title", t(key));
    });

    const title = t("meta.title");
    const description = t("meta.description");

    if (title && title !== "meta.title") {
      document.title = title;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description && description !== "meta.description") {
      metaDescription.setAttribute("content", description);
    }

    document.documentElement.lang = currentLocale;
    document.documentElement.dir = RTL_LOCALES.has(currentLocale) ? "rtl" : "ltr";
    document.body.classList.toggle("rtl", RTL_LOCALES.has(currentLocale));

    const langSelect = document.getElementById("lang-select");
    if (langSelect instanceof HTMLSelectElement) {
      langSelect.value = currentLocale;
    }

    document.dispatchEvent(
      new CustomEvent("i18n:changed", {
        detail: { locale: currentLocale },
      })
    );
  }

  /**
   * @param {string} locale
   * @returns {Promise<void>}
   */
  async function loadLocale(locale) {
    const safeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
    const response = await fetch(`locales/${safeLocale}.json`, { cache: "no-cache" });

    if (!response.ok) {
      throw new Error(`Failed to load locale: ${safeLocale}`);
    }

    dictionary = await response.json();
    currentLocale = safeLocale;
    localStorage.setItem(STORAGE_KEY, safeLocale);
    applyTranslations();
  }

  /**
   * @returns {string}
   */
  function detectLocale() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      return stored;
    }

    const browser = (navigator.language || DEFAULT_LOCALE).slice(0, 2).toLowerCase();
    return SUPPORTED_LOCALES.includes(browser) ? browser : DEFAULT_LOCALE;
  }

  /**
   * @returns {Promise<void>}
   */
  async function initI18n() {
    const locale = detectLocale();

    try {
      await loadLocale(locale);
    } catch (error) {
      console.error(error);
      if (locale !== DEFAULT_LOCALE) {
        await loadLocale(DEFAULT_LOCALE);
      }
    }

    const langSelect = document.getElementById("lang-select");
    if (langSelect) {
      langSelect.addEventListener("change", (event) => {
        const target = /** @type {HTMLSelectElement} */ (event.target);
        loadLocale(target.value).catch((err) => console.error(err));
      });
    }
  }

  global.AGT_I18N = {
    t,
    loadLocale,
    applyTranslations,
    initI18n,
    getLocale: () => currentLocale,
    supportedLocales: SUPPORTED_LOCALES.slice(),
  };

  global.t = t;
})(window);
