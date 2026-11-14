/* Core runtime: formatting, state, hash router, design registry and the render loop.
   The design registers itself with RC.registerDesign() (js/views.js) and renders every route with its own markup. */
window.RC = window.RC || {};

(function () {
  var D = RC.data;
  var STORE_CURRENCY = 'rc-currency';
  var STORE_FAVS = 'rc-favorites';

  function read(key, fallback) { try { var v = localStorage.getItem(key); return v === null ? fallback : v; } catch (e) { return fallback; } }
  function write(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } }

  // ---- formatting ----------------------------------------------------------------------------
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  RC.fmt = {
    MONTHS: MONTHS,
    DAYS: DAYS,
    num: function (n) { return Math.round(n).toLocaleString('en-US'); },
    all: function (n) { return RC.fmt.num(n) + ' ALL'; },
    eur: function (n) { return '≈ ' + RC.fmt.num(n / D.eurRate) + ' €'; },
    // Price respecting the visitor's display currency. ALL is the base currency; EUR is shown with "≈".
    price: function (n) {
      return RC.state.currency === 'EUR'
        ? { main: RC.fmt.eur(n), alt: RC.fmt.all(n), value: '≈ ' + RC.fmt.num(n / D.eurRate), unit: '€' }
        : { main: RC.fmt.all(n), alt: RC.fmt.eur(n), value: RC.fmt.num(n), unit: 'ALL' };
    },
    parse: function (iso) { var p = iso.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); },
    iso: function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); },
    dayShort: function (d) { return DAYS[d.getDay()].slice(0, 3) + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); },
    dateShort: function (d) { return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); },
    dateLong: function (d) { return DAYS[d.getDay()] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); },
    monthLabel: function (y, m) { return MONTHS[m] + ' ' + y; }
  };

  RC.esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  // ---- state ---------------------------------------------------------------------------------
  var favs = [];
  try { favs = JSON.parse(read(STORE_FAVS, '["mercedes-c"]')) || []; } catch (e) { favs = []; }

  RC.state = {
    design: document.documentElement.getAttribute('data-design') || 'd1',
    currency: read(STORE_CURRENCY, 'ALL') === 'EUR' ? 'EUR' : 'ALL',
    search: Object.assign({}, D.search),
    favorites: favs,
    cal: { y: 2026, m: 10, day: 14 },
    // The site always opens in light mode; the header toggle switches theme for the current visit only.
    themeMode: 'light',
    theme: 'light',
    route: null
  };

  RC.isFav = function (id) { return RC.state.favorites.indexOf(id) >= 0; };
  RC.toggleFav = function (id) {
    var i = RC.state.favorites.indexOf(id);
    if (i >= 0) RC.state.favorites.splice(i, 1); else RC.state.favorites.push(id);
    write(STORE_FAVS, JSON.stringify(RC.state.favorites));
    return i < 0;
  };

  // Rental length in 24-hour blocks from pickup time (spec 4.2.3): any extra time counts as a full day.
  RC.searchInfo = function () {
    var s = RC.state.search;
    var a = new Date(s.pickupDate + 'T' + s.pickupTime), b = new Date(s.returnDate + 'T' + s.returnTime);
    var days = Math.max(1, Math.ceil((b - a) / 86400000));
    var pd = RC.fmt.parse(s.pickupDate), rd = RC.fmt.parse(s.returnDate);
    return {
      location: s.location, days: days, pickup: pd, ret: rd, pickupTime: s.pickupTime, returnTime: s.returnTime,
      pickupLabel: RC.fmt.dayShort(pd) + ', ' + s.pickupTime,
      returnLabel: RC.fmt.dayShort(rd) + ', ' + s.returnTime,
      range: RC.fmt.dateShort(pd) + ' – ' + RC.fmt.dateShort(rd)
    };
  };

  // Total for a vehicle using the long-rental discount example from the spec (10% from 7 days).
  RC.quote = function (v, days) {
    days = days || RC.searchInfo().days;
    var base = v.price * days, discount = days >= 7 ? Math.round(base * 0.1) : 0;
    return { days: days, perDay: v.price, base: base, discount: discount, total: base - discount };
  };

  RC.vehicle = function (id) { return D.vehicles.filter(function (v) { return v.id === id; })[0] || D.vehicles[0]; };
  RC.provider = function (id) { return D.providers[id]; };
  RC.location = function (id) { return D.locations[id]; };

  // ---- routing -------------------------------------------------------------------------------
  RC.routes = [
    { path: '/', name: 'home', label: 'Homepage', group: 'Customer website' },
    { path: '/search', name: 'search', label: 'Search results', group: 'Customer website' },
    { path: '/vehicle/mercedes-c', name: 'vehicle', label: 'Vehicle details', group: 'Customer website' },
    { path: '/signin', name: 'signin', label: 'Sign in', group: 'Customer website' },
    { path: '/signup', name: 'signup', label: 'Create account', group: 'Customer website' },
    { path: '/forgot', name: 'forgot', label: 'Forgot password', group: 'Customer website' },
    { path: '/owner/overview', name: 'owner', label: 'Overview', group: 'Rental provider dashboard' },
    { path: '/owner/fleet', name: 'owner', label: 'Fleet management', group: 'Rental provider dashboard' },
    { path: '/owner/reservations', name: 'owner', label: 'Reservations', group: 'Rental provider dashboard' },
    { path: '/owner/calendar', name: 'owner', label: 'Availability calendar', group: 'Rental provider dashboard' },
    { path: '/owner/locations', name: 'owner', label: 'Locations', group: 'Rental provider dashboard' },
    { path: '/owner/messages', name: 'owner', label: 'Messages (empty state)', group: 'Rental provider dashboard' },
    { path: '/admin/overview', name: 'admin', label: 'Overview', group: 'Administrator dashboard' },
    { path: '/admin/users', name: 'admin', label: 'User management', group: 'Administrator dashboard' },
    { path: '/admin/reservations', name: 'admin', label: 'Reservation management', group: 'Administrator dashboard' },
    { path: '/admin/reports', name: 'admin', label: 'Reports (empty state)', group: 'Administrator dashboard' },
    { path: '/styleguide', name: 'styleguide', label: 'Design system / style guide', group: 'Design system' }
  ];

  RC.parseRoute = function () {
    var path = (location.hash || '#/').replace(/^#/, '') || '/';
    path = path.split('?')[0];
    var parts = path.split('/').filter(Boolean);
    var r = { path: '/' + parts.join('/'), name: 'home', params: {} };
    if (!parts.length) r.path = '/';
    else if (parts[0] === 'search') r.name = 'search';
    else if (parts[0] === 'vehicle') { r.name = 'vehicle'; r.params.id = parts[1] || 'mercedes-c'; }
    else if (['signin', 'signup', 'forgot'].indexOf(parts[0]) >= 0) r.name = parts[0];
    else if (parts[0] === 'owner') { r.name = 'owner'; r.params.view = parts[1] || 'overview'; }
    else if (parts[0] === 'admin') { r.name = 'admin'; r.params.view = parts[1] || 'overview'; }
    else if (parts[0] === 'styleguide') r.name = 'styleguide';
    else r.path = '/';
    return r;
  };

  RC.go = function (path) {
    if (('#' + path) === location.hash) RC.render({ keepScroll: false });
    else location.hash = path;
  };

  // ---- designs -------------------------------------------------------------------------------
  RC.designs = {};
  RC.designOrder = [];
  RC.registerDesign = function (id, def) { def.id = id; RC.designs[id] = def; RC.designOrder.push(id); };
  RC.design = function () { return RC.designs[RC.state.design]; };


  RC.setCurrency = function (cur) {
    RC.state.currency = cur === 'EUR' ? 'EUR' : 'ALL';
    write(STORE_CURRENCY, RC.state.currency);
    RC.render({ keepScroll: true });
    RC.toast('Prices shown in ' + (cur === 'EUR' ? 'EUR (≈, converted at 1 € = ' + D.eurRate.toFixed(2) + ' ALL)' : 'Albanian lek (ALL)'), 'info');
  };

  // ---- theme (light / dark / auto) — CSS-only, no re-render needed ----------------------------
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  RC.resolveTheme = function () {
    var m = RC.state.themeMode;
    return m === 'auto' ? (darkQuery && darkQuery.matches ? 'dark' : 'light') : m;
  };
  RC.applyTheme = function () {
    RC.state.theme = RC.resolveTheme();
    document.documentElement.setAttribute('data-theme', RC.state.theme);
    var label = RC.state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) { b.setAttribute('aria-label', label); b.setAttribute('data-tip', label); });
    document.dispatchEvent(new CustomEvent('rc:theme', { detail: { mode: RC.state.themeMode, theme: RC.state.theme } }));
  };
  RC.setTheme = function (mode) {
    RC.state.themeMode = /^(light|dark|auto)$/.test(mode) ? mode : 'auto';
    RC.applyTheme();
  };
  RC.toggleTheme = function () { RC.setTheme(RC.state.theme === 'dark' ? 'light' : 'dark'); };
  if (darkQuery) {
    var onOsChange = function () { if (RC.state.themeMode === 'auto') RC.applyTheme(); };
    if (darkQuery.addEventListener) darkQuery.addEventListener('change', onOsChange); else if (darkQuery.addListener) darkQuery.addListener(onOsChange);
  }

  // ---- render --------------------------------------------------------------------------------
  RC.render = function (opts) {
    opts = opts || {};
    var app = document.getElementById('app');
    var route = RC.parseRoute();
    var design = RC.design();
    RC.state.route = route;
    if (!design) { app.innerHTML = ''; return; }
    var view = design.views[route.name] || design.views.home;
    RC.closeOverlays && RC.closeOverlays();
    app.innerHTML = view(route);
    app.setAttribute('data-route', route.name);
    document.title = (design.titles && design.titles[route.name] ? design.titles[route.name] + ' · ' : '') + 'RentCar';
    if (RC.hydrate) RC.hydrate(app, route);
    RC.applyTheme();
    if (design.mounted) design.mounted(app, route);
    if (!opts.keepScroll) window.scrollTo(0, 0);
  };

  // ---- toasts --------------------------------------------------------------------------------
  RC.toast = function (message, type) {
    type = type || 'success';
    var stack = document.querySelector('.toast-stack');
    if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; stack.setAttribute('aria-live', 'polite'); document.body.appendChild(stack); }
    var icon = { success: 'checkCircle', info: 'info', warning: 'alert', error: 'alertCircle' }[type] || 'info';
    var el = document.createElement('div');
    el.className = 'toast toast-' + type;
    el.setAttribute('role', 'status');
    el.innerHTML = RC.icon(icon, 'toast-icon') + '<div class="toast-text">' + RC.esc(message) + '</div>' +
      '<button class="toast-close" type="button" aria-label="Dismiss">' + RC.icon('x') + '</button>';
    stack.appendChild(el);
    requestAnimationFrame(function () { el.classList.add('is-in'); });
    var remove = function () { el.classList.remove('is-in'); el.classList.add('is-out'); setTimeout(function () { el.remove(); }, 260); };
    el.querySelector('.toast-close').addEventListener('click', remove);
    setTimeout(remove, 3800);
    while (stack.children.length > 3) stack.firstChild.remove();
  };

  window.addEventListener('hashchange', function () { RC.render({ keepScroll: false }); });
})();
