/*!
 * Songzy — analytics + consent bootstrapper.
 * Reads window.__SONGZY_CONFIG__ (injected by /api/env.js) and lazily loads
 * Iubenda, GA4, Meta Pixel, and TikTok Pixel. Missing IDs = silently skipped.
 * Iubenda fires first so it can block the rest until consent is granted via
 * its autoblocking script.
 */
(function () {
  'use strict';
  var C = window.__SONGZY_CONFIG__ || {};

  function load(src, opts) {
    var s = document.createElement('script');
    s.src = src; s.async = true;
    if (opts && opts.crossorigin) s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
    return s;
  }

  // -- Iubenda Cookie Solution --------------------------------------------
  if (C.IUBENDA_SITE_ID) {
    window._iub = window._iub || [];
    window._iub.csConfiguration = {
      siteId: Number(C.IUBENDA_SITE_ID) || C.IUBENDA_SITE_ID,
      cookiePolicyId: Number(C.IUBENDA_COOKIE_POLICY_ID) || C.IUBENDA_COOKIE_POLICY_ID,
      lang: 'en',
      storage: { useSiteId: true }
    };
    load('https://cs.iubenda.com/autoblocking/' + C.IUBENDA_SITE_ID + '.js');
    load('//cdn.iubenda.com/cs/iubenda_cs.js');
  }

  // -- GA4 ----------------------------------------------------------------
  if (C.GA4_ID) {
    load('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(C.GA4_ID));
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', C.GA4_ID, { anonymize_ip: true });
  }

  // -- Meta Pixel ---------------------------------------------------------
  if (C.META_PIXEL_ID) {
    (function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
      if (!f._fbq) f._fbq = n;
      n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
      t = b.createElement(e); t.async = !0; t.src = v;
      s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', C.META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // -- TikTok Pixel -------------------------------------------------------
  if (C.TIKTOK_PIXEL_ID) {
    (function (w, d, t) {
      w.TiktokAnalyticsObject = t;
      var ttq = w[t] = w[t] || [];
      ttq.methods = ['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie','holdConsent','revokeConsent','grantConsent'];
      ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; };
      for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]);
      ttq.instance = function (t) { var e = ttq._i[t] || []; for (var n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e; };
      ttq.load = function (e, n) {
        var r = 'https://analytics.tiktok.com/i18n/pixel/events.js';
        ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r;
        ttq._t = ttq._t || {}; ttq._t[e] = +new Date();
        ttq._o = ttq._o || {}; ttq._o[e] = n || {};
        var o = d.createElement('script');
        o.type = 'text/javascript'; o.async = !0;
        o.src = r + '?sdkid=' + e + '&lib=' + t;
        var a = d.getElementsByTagName('script')[0];
        a.parentNode.insertBefore(o, a);
      };
      ttq.load(C.TIKTOK_PIXEL_ID);
      ttq.page();
    })(window, document, 'ttq');
  }

  // -- Vercel Analytics (no ID required; just load the script) ------------
  // Vercel injects its own script automatically when deployed; on the static
  // page we only need the client so it can record pageviews.
  // See: https://vercel.com/docs/analytics/quickstart
  try {
    var va = document.createElement('script');
    va.defer = true; va.src = '/_vercel/insights/script.js';
    va.setAttribute('data-endpoint', '/_vercel/insights');
    document.head.appendChild(va);
  } catch (e) { /* no-op */ }

  // -- Public helper: songzyTrack('AddToCart', { tier:'quick' }) ----------
  window.songzyTrack = function (event, params) {
    try { if (window.gtag && C.GA4_ID)  window.gtag('event', event, params || {}); } catch (e) {}
    try { if (window.fbq  && C.META_PIXEL_ID)  window.fbq('trackCustom', event, params || {}); } catch (e) {}
    try { if (window.ttq  && C.TIKTOK_PIXEL_ID) window.ttq.track(event, params || {}); } catch (e) {}
  };
})();
