/**
 * Cornerstone Constructs – shared header loader
 *
 * On every page, add in <head> or before </body>:
 *   <script src="Header/header.js"></script>
 *
 * (Adjust the path if the page is in a subfolder, e.g. ../Header/header.js)
 *
 * This script:
 *  1. Loads Header/header.css
 *  2. Fetches Header/header.html and injects it at the top of <body>
 *  3. Wires up the mobile hamburger menu
 */
(function () {
  'use strict';

  // Resolve base path relative to this script file
  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var base = '';
  if (thisScript && thisScript.src) {
    base = thisScript.src.replace(/header\.js(?:\?.*)?$/i, '');
  } else {
    base = 'Header/';
  }

  // 1) CSS
  if (!document.querySelector('link[data-cornerstone-header]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'header.css';
    link.setAttribute('data-cornerstone-header', 'true');
    document.head.appendChild(link);
  }

  function initMobileMenu() {
    var hamburger = document.querySelector('.hamburger');
    var mobileNav = document.getElementById('mobileNav');
    var overlay = document.querySelector('.mobile-overlay');
    var mobileDropdowns = document.querySelectorAll('.mobile-dropdown');

    if (!hamburger || !mobileNav || !overlay) return;

    function openMenu() {
      mobileNav.classList.add('active');
      overlay.classList.add('active');
      hamburger.textContent = '✕';
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mobileNav.classList.remove('active');
      overlay.classList.remove('active');
      hamburger.textContent = '☰';
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobileNav.classList.contains('active')) closeMenu();
      else openMenu();
    });

    overlay.addEventListener('click', closeMenu);

    mobileDropdowns.forEach(function (dropdown) {
      var dropbtn = dropdown.querySelector('.mobile-dropbtn');
      if (dropbtn) {
        dropbtn.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          dropdown.classList.toggle('active');
        });
      }
      dropdown.querySelectorAll('.mobile-submenu-title').forEach(function (title) {
        title.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          title.parentElement.classList.toggle('active');
        });
      });
    });

    document.querySelectorAll('.mobile-menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (
          !link.classList.contains('mobile-submenu-title') &&
          !link.classList.contains('mobile-dropbtn')
        ) {
          closeMenu();
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('active')) closeMenu();
    });
  }

  function injectHeader(html) {
    // Avoid double inject
    if (document.querySelector('header .header-container')) {
      initMobileMenu();
      return;
    }
    var wrap = document.createElement('div');
    wrap.id = 'cornerstone-header-root';
    wrap.innerHTML = html;

    function place() {
      if (!document.body) return;
      // Insert fragments in order at the start of body
      while (wrap.firstChild) {
        document.body.insertBefore(wrap.firstChild, document.body.firstChild);
      }
      initMobileMenu();
    }

    if (document.body) place();
    else document.addEventListener('DOMContentLoaded', place);
  }

  // 2) HTML
  fetch(base + 'header.html')
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load header.html (' + res.status + ')');
      return res.text();
    })
    .then(injectHeader)
    .catch(function (err) {
      console.error('[Cornerstone header]', err);
    });
})();
