/**
 * Cornerstone Constructs – shared footer loader
 *
 * On every page, add before </body>:
 *   <script src="Footer/footer.js"></script>
 *
 * (Use ../Footer/footer.js if the page is in a subfolder.)
 *
 * This script:
 *  1. Loads Footer/footer.css
 *  2. Fetches Footer/footer.html and appends it at the end of <body>
 */
(function () {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var thisScript = scripts[scripts.length - 1];
  var base = '';
  if (thisScript && thisScript.src) {
    base = thisScript.src.replace(/footer\.js(?:\?.*)?$/i, '');
  } else {
    base = 'Footer/';
  }

  // 1) CSS
  if (!document.querySelector('link[data-cornerstone-footer]')) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = base + 'footer.css';
    link.setAttribute('data-cornerstone-footer', 'true');
    document.head.appendChild(link);
  }

  function injectFooter(html) {
    if (document.querySelector('footer.site-footer')) return;

    var wrap = document.createElement('div');
    wrap.innerHTML = html.trim();

    function place() {
      if (!document.body) return;
      while (wrap.firstChild) {
        document.body.appendChild(wrap.firstChild);
      }
    }

    if (document.body) place();
    else document.addEventListener('DOMContentLoaded', place);
  }

  // 2) HTML
  fetch(base + 'footer.html')
    .then(function (res) {
      if (!res.ok) throw new Error('Could not load footer.html (' + res.status + ')');
      return res.text();
    })
    .then(injectFooter)
    .catch(function (err) {
      console.error('[Cornerstone footer]', err);
    });
})();
