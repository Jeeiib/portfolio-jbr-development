// Theme initialization script - runs before React hydration to prevent FOUC
(function() {
  var stored = localStorage.getItem('theme');
  // Default to dark mode if no preference stored
  var theme = stored || 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();
