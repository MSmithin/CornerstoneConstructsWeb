/**
 * Cornerstone Constructs – shared page loader
 * Include on any page with:
 *   <script src="page-loader.js"></script>
 * Place the script near the end of <body> (or in <head> with defer).
 *
 * Logo path: Cornerstone Logo-Img/Cornerstone-2.png
 * (same folder structure as the home page)
 */
(function () {
  'use strict';

  // Avoid double-injecting if the script is included twice
  if (document.getElementById('pageLoader')) return;

  // ----- Styles -----
  var css = `
    .page-loader {
      position: fixed;
      inset: 0;
      background: #FF914D;
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.9s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.4s ease 0.5s;
    }
    .page-loader.loaded {
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
    }
    .page-loader-inner {
      width: min(88vw, 480px);
      display: flex;
      justify-content: flex-start;
    }
    .page-loader-reveal {
      overflow: hidden;
      width: 0;
      animation: logoReveal 1.15s cubic-bezier(0.4, 0, 0.2, 1) 0.15s forwards;
    }
    .page-loader-logo {
      display: block;
      width: min(88vw, 480px);
      height: auto;
      max-width: none;
    }
    @keyframes logoReveal {
      0%   { width: 18%; }
      100% { width: 100%; }
    }
    @media (max-width: 480px) {
      .page-loader-inner { width: min(92vw, 360px); }
      .page-loader-logo  { width: min(92vw, 360px); }
    }
  `;

  var style = document.createElement('style');
  style.setAttribute('data-page-loader', 'true');
  style.textContent = css;
  document.head.appendChild(style);

  // ----- HTML -----
  var loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.id = 'pageLoader';
  loader.innerHTML =
    '<div class="page-loader-inner">' +
      '<div class="page-loader-reveal">' +
        '<img class="page-loader-logo" src="Cornerstone Logo-Img/Cornerstone-2.png" alt="Cornerstone Constructs">' +
      '</div>' +
    '</div>';

  // Insert as early as possible so it covers the page
  if (document.body) {
    document.body.insertBefore(loader, document.body.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.insertBefore(loader, document.body.firstChild);
    });
  }

  // ----- Dismiss after logo reveal -----
  function dismissLoader() {
    var el = document.getElementById('pageLoader');
    if (el) el.classList.add('loaded');
  }

  if (document.readyState === 'complete') {
    setTimeout(dismissLoader, 1600);
  } else {
    window.addEventListener('load', function () {
      setTimeout(dismissLoader, 1600);
    });
  }
})();
