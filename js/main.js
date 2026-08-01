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

  // Keep theme toggle label in sync with active language
  const syncThemeLabel = () => {
    const label = document.querySelector("[data-i18n='theme.toggle']");
    if (label && window.t) {
      label.textContent = window.t("theme.toggle");
    }
  };

  document.addEventListener("i18n:changed", syncThemeLabel);
  document.addEventListener("theme:changed", syncThemeLabel);
});
