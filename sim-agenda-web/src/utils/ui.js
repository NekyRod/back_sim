// src/utils/ui.js
import logoGOI from '../img/logo_goi.jpg';
import logoSanitas from '../img/logo-sanitas.png';
// Muestra un toast usando el <div id="toast"> del HTML
export function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2600);
}
