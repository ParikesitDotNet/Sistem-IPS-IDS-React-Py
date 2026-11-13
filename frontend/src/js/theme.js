/**
 * Theme Management Module
 * Supports Dark Mode (Slate/Navy) and Light Mode (White/Slate)
 * Dispatches 'themeChanged' event for charts and reactive components
 */

const STORAGE_KEY = 'ids_ips_theme';

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = saved || (prefersDark ? 'dark' : 'dark'); // Default to dark for cybersecurity aesthetic

  setTheme(currentTheme, false);
}

export function getTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

export function setTheme(theme, persist = true) {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  if (persist) {
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // Dispatch custom event for charts and components
  window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

export function toggleTheme() {
  const newTheme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(newTheme, true);
  return newTheme;
}
