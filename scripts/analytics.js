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

  // -- TikTok standard events helper -------------------------------------
  // Pricing per tier (Songzy)
  var TIER_VALUE = { quick: 19, personal: 39, premium: 69 };
  function tierName(t) { return 'Songzy ' + (t || 'personal').replace(/^./, function(c){return c.toUpperCase();}) + ' Song'; }

  /**
   * songzyTikTokEvent — fires a standard TikTok event with the Songzy content schema.
   * Standard events: ViewContent, AddToCart, InitiateCheckout, AddPaymentInfo,
   *                  PlaceAnOrder, CompleteRegistration, Purchase
   */
  window.songzyTikTokEvent = function (eventName, opts) {
    opts = opts || {};
    if (!window.ttq || !C.TIKTOK_PIXEL_ID) return;
    var tier = opts.tier || 'personal';
    var value = opts.value != null ? Number(opts.value) : (TIER_VALUE[tier] || 39);
    var currency = opts.currency || 'EUR';
    var payload = {
      contents: [{
        content_id: opts.content_id || ('songzy_' + tier),
        content_type: 'product',
        content_name: opts.content_name || tierName(tier),
      }],
      value: value,
      currency: currency,
    };
    if (opts.event_id) payload.event_id = opts.event_id;
    try { window.ttq.track(eventName, payload); } catch (e) {}
    // Also send to GA4 / Meta as the matching standard event when possible
    try {
      if (window.gtag && C.GA4_ID) {
        var ga4Event = { Purchase: 'purchase', AddToCart: 'add_to_cart', InitiateCheckout: 'begin_checkout', ViewContent: 'view_item', CompleteRegistration: 'sign_up' }[eventName] || eventName.toLowerCase();
        window.gtag('event', ga4Event, { value: value, currency: currency, items: payload.contents });
      }
    } catch (e) {}
    try {
      if (window.fbq && C.META_PIXEL_ID) {
        var metaEvent = { Purchase: 'Purchase', AddToCart: 'AddToCart', InitiateCheckout: 'InitiateCheckout', ViewContent: 'ViewContent', CompleteRegistration: 'CompleteRegistration' }[eventName] || null;
        if (metaEvent) window.fbq('track', metaEvent, { value: value, currency: currency, content_ids: [payload.contents[0].content_id] });
      }
    } catch (e) {}
  };

  // -- Auto-fire standard events based on page URL / clicks --------------
  document.addEventListener('DOMContentLoaded', function () {
    var pathname = location.pathname;

    // ViewContent on landing pages and blog (any non-utility page)
    var isContentPage = !/^\/(api|admin|checkout|order-brief|m-song|robots\.txt|sitemap\.xml)/.test(pathname);
    if (isContentPage && C.TIKTOK_PIXEL_ID) {
      var slug = pathname.replace(/^\//, '').replace(/\.html$/, '') || 'home';
      window.songzyTikTokEvent('ViewContent', {
        content_id: 'songzy_page_' + slug,
        content_name: document.title || 'Songzy page',
      });
    }

    // InitiateCheckout when /checkout loads
    if (/^\/checkout/.test(pathname)) {
      var tier = new URLSearchParams(location.search).get('tier') || 'personal';
      window.songzyTikTokEvent('InitiateCheckout', { tier: tier });
    }

    // Purchase when /order-brief opens with a paid session_id
    if (/^\/order-brief/.test(pathname)) {
      var sid = new URLSearchParams(location.search).get('session_id');
      if (sid) {
        window.songzyTikTokEvent('Purchase', {
          tier: new URLSearchParams(location.search).get('tier') || 'personal',
          event_id: sid, // dedup with server-side event via Stripe webhook
        });
      }
    }

    // AddToCart on any CTA click with data-tier (set by landing pages + main pricing)
    document.addEventListener('click', function (e) {
      var el = e.target.closest && e.target.closest('[data-cta][data-tier], a[href*="checkout.html"]');
      if (!el) return;
      var tier = el.getAttribute('data-tier');
      if (!tier) {
        // try to extract from href like /checkout.html?tier=personal
        var href = el.getAttribute('href') || '';
        var m = href.match(/tier=([a-z]+)/);
        if (m) tier = m[1];
      }
      window.songzyTikTokEvent('AddToCart', { tier: tier || 'personal' });
    });
  });
})();
