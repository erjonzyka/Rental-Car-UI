/* Shared markup helpers. They emit a common component vocabulary (.btn, .field, .badge, .table,
   .modal, .dropdown, .map …). The vocabulary is shared, the look is not: every concept styles these
   classes in its own components.css, and page layouts are written separately per concept. */
window.RC = window.RC || {};

(function () {
  var D = RC.data, F = RC.fmt, esc = RC.esc, I = RC.icon;
  var ui = RC.ui = {};

  function attrs(o) {
    var s = '';
    for (var k in o) if (o[k] !== undefined && o[k] !== null && o[k] !== false) s += ' ' + k + (o[k] === true ? '' : '="' + esc(o[k]) + '"');
    return s;
  }
  ui.attrs = attrs;

  // ---- ratings / badges -----------------------------------------------------------------------
  ui.stars = function (rating, size) {
    var out = '<span class="stars' + (size ? ' stars-' + size : '') + '" role="img" aria-label="' + rating + ' out of 5">';
    for (var i = 1; i <= 5; i++) out += I('star', rating >= i - 0.25 ? 'is-on' : (rating >= i - 0.75 ? 'is-half' : ''));
    return out + '</span>';
  };

  // "4.8 ★ (31)" or the "New" label for cars without reviews (spec 11.7.1–11.7.2)
  ui.rating = function (v, opts) {
    opts = opts || {};
    if (!v.reviews) return '<span class="badge badge-new">New</span>';
    return '<span class="rating">' + I('star', 'rating-star') + '<b>' + v.rating.toFixed(1) + '</b>' +
      (opts.noCount ? '' : '<span class="rating-count">(' + v.reviews + (opts.long ? ' reviews' : '') + ')</span>') + '</span>';
  };

  var STATUS = {
    'Confirmed': 'info', 'In progress': 'brand', 'Completed': 'success', 'Pending payment': 'warning',
    'Cancelled': 'neutral', 'No-show': 'danger', 'Active': 'success', 'Inactive': 'neutral',
    'Suspended': 'danger', 'Deleted': 'neutral', 'Archived': 'neutral', 'Paid': 'success', 'Issued': 'warning'
  };
  ui.statusTone = function (s) { return STATUS[s] || 'neutral'; };
  ui.badge = function (label, tone, opts) {
    opts = opts || {};
    return '<span class="badge badge-' + (tone || ui.statusTone(label)) + '">' + (opts.dot === false ? '' : '<span class="badge-dot"></span>') + esc(label) + '</span>';
  };
  ui.status = function (s) { return ui.badge(s, ui.statusTone(s)); };

  ui.availability = function (v) {
    return v.availability === 'limited'
      ? '<span class="avail avail-limited"><span class="avail-dot"></span>Only 1 left for these dates</span>'
      : '<span class="avail avail-ok"><span class="avail-dot"></span>Available · instant confirmation</span>';
  };

  ui.payments = function (provider) {
    return provider.payments.map(function (p) {
      return '<span class="pay pay-' + p + '">' + I(p === 'card' ? 'card' : 'cash') + (p === 'card' ? 'Card' : 'Cash') + '</span>';
    }).join('');
  };

  // In-page light/dark toggle. Each concept passes its own button classes.
  ui.themeToggle = function (cls) {
    return '<button type="button" class="' + cls + ' theme-toggle" data-theme-toggle aria-label="Switch to dark mode">' + I('moon', 'theme-ico-moon') + I('sun', 'theme-ico-sun') + '</button>';
  };

  ui.plate = function (text) { return '<span class="plate"><span class="plate-cc">AL</span><span class="plate-no">' + esc(text) + '</span></span>'; };

  var AV_TONES = 6;
  ui.avatar = function (name, size) {
    var parts = String(name).replace(/[^\p{L}\s]/gu, '').trim().split(/\s+/);
    var ini = (parts[0] ? parts[0][0] : '?') + (parts.length > 1 ? parts[parts.length - 1][0] : '');
    var h = 0; for (var i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    return '<span class="avatar avatar-t' + (h % AV_TONES + 1) + (size ? ' avatar-' + size : '') + '" aria-hidden="true">' + esc(ini.toUpperCase()) + '</span>';
  };

  ui.img = function (src, alt, cls, extra) {
    return '<img src="' + esc(src) + '" alt="' + esc(alt || '') + '"' + (cls ? ' class="' + cls + '"' : '') + ' loading="lazy" decoding="async"' + (extra || '') + '>';
  };
  // Gallery frame that can "zoom" into a region of a photo (used for detail shots)
  ui.galleryImg = function (g, alt, cls) {
    return '<img src="' + esc(g.src) + '" alt="' + esc(alt || '') + '" class="' + (cls || '') + '" style="object-position:' + g.pos + ';--zoom:' + g.zoom + '" loading="lazy" decoding="async">';
  };

  // ---- form controls --------------------------------------------------------------------------
  ui.input = function (o) {
    var id = o.id || ('f-' + (o.name || Math.random().toString(36).slice(2, 8)));
    var control = o.type === 'textarea'
      ? '<textarea class="input" id="' + id + '"' + attrs({ name: o.name, placeholder: o.placeholder, rows: o.rows || 4, required: o.required, maxlength: o.maxlength }) + '>' + esc(o.value || '') + '</textarea>'
      : '<input class="input" id="' + id + '"' + attrs({ type: o.type || 'text', name: o.name, placeholder: o.placeholder, value: o.value, required: o.required, autocomplete: o.autocomplete, minlength: o.minlength, disabled: o.disabled, readonly: o.readonly, 'data-match': o.match, inputmode: o.inputmode }) + '>';
    var hasIcon = !!o.icon, pw = o.type === 'password';
    return '<div class="field' + (o.state ? ' is-' + o.state : '') + (o.cls ? ' ' + o.cls : '') + '">' +
      (o.label ? '<label class="field-label" for="' + id + '">' + esc(o.label) + (o.optional ? ' <span class="field-optional">Optional</span>' : '') + (o.labelAside || '') + '</label>' : '') +
      '<div class="control' + (hasIcon ? ' has-icon' : '') + (pw ? ' has-action' : '') + (o.prefix ? ' has-prefix' : '') + '">' +
      (hasIcon ? I(o.icon, 'control-icon') : '') +
      (o.prefix ? '<span class="control-prefix">' + esc(o.prefix) + '</span>' : '') + control +
      (pw ? '<button type="button" class="control-action" data-pw-toggle aria-label="Show password">' + I('eye') + '</button>' : '') +
      (o.state === 'valid' ? I('checkCircle', 'control-state') : '') +
      '</div>' +
      (o.strength ? '<div class="strength" data-strength-for="' + id + '"><span></span><span></span><span></span><span></span><em>Use 8+ characters with a number</em></div>' : '') +
      '<p class="field-error" role="alert">' + esc(o.error || '') + '</p>' +
      (o.hint ? '<p class="field-hint">' + esc(o.hint) + '</p>' : '') +
      '</div>';
  };

  ui.select = function (o) {
    var id = o.id || ('s-' + (o.name || Math.random().toString(36).slice(2, 8)));
    var opts = o.options.map(function (op) {
      var val = Array.isArray(op) ? op[0] : op, lab = Array.isArray(op) ? op[1] : op;
      return '<option value="' + esc(val) + '"' + (String(val) === String(o.value) ? ' selected' : '') + '>' + esc(lab) + '</option>';
    }).join('');
    return '<div class="field' + (o.state ? ' is-' + o.state : '') + (o.cls ? ' ' + o.cls : '') + '">' +
      (o.label ? '<label class="field-label" for="' + id + '">' + esc(o.label) + '</label>' : '') +
      '<div class="control control-select' + (o.icon ? ' has-icon' : '') + '">' + (o.icon ? I(o.icon, 'control-icon') : '') +
      '<select class="input select" id="' + id + '"' + attrs({ name: o.name, required: o.required, disabled: o.disabled, 'data-sort': o.sort }) + '>' + opts + '</select>' + I('chevronDown', 'select-caret') + '</div>' +
      '<p class="field-error" role="alert">' + esc(o.error || '') + '</p>' +
      (o.hint ? '<p class="field-hint">' + esc(o.hint) + '</p>' : '') + '</div>';
  };

  ui.check = function (o) {
    return '<label class="check' + (o.cls ? ' ' + o.cls : '') + '"><input type="' + (o.type || 'checkbox') + '"' +
      attrs({ name: o.name, value: o.value, checked: o.checked, required: o.required, disabled: o.disabled, 'data-filter': o.filter }) +
      '><span class="check-box" aria-hidden="true">' + I('check') + '</span><span class="check-label">' + o.label + '</span>' +
      (o.count != null ? '<span class="check-count">' + o.count + '</span>' : '') + '</label>';
  };

  ui.switch = function (o) {
    return '<label class="switch"><input type="checkbox"' + attrs({ name: o.name, checked: o.checked, disabled: o.disabled }) + '><span class="switch-track" aria-hidden="true"><span class="switch-thumb"></span></span><span class="switch-label">' + esc(o.label) + '</span></label>';
  };

  ui.timeOptions = function (selected) {
    var out = '';
    for (var h = 6; h <= 22; h++) ['00', '30'].forEach(function (mm) {
      var t = String(h).padStart(2, '0') + ':' + mm;
      out += '<option value="' + t + '"' + (t === selected ? ' selected' : '') + '>' + t + '</option>';
    });
    return out;
  };

  // Date field that opens the shared date picker popover (interactions.js)
  ui.dateInput = function (o) {
    var d = F.parse(o.value);
    return '<button type="button" class="date-input ' + (o.cls || '') + '" data-datepicker="' + o.name + '" data-value="' + o.value + '"' + (o.range ? ' data-range="' + o.range + '"' : '') + ' aria-label="' + esc(o.label || 'Choose date') + '">' +
      (o.icon === false ? '' : I('calendar', 'date-input-icon')) + '<span class="date-input-text" data-date-text>' + F.dayShort(d) + '</span></button>' +
      '<input type="hidden" name="' + o.name + '" value="' + o.value + '">';
  };

  ui.timeSelect = function (o) {
    return '<span class="time-select ' + (o.cls || '') + '">' + (o.icon === false ? '' : I('clock', 'time-select-icon')) + '<select name="' + o.name + '" aria-label="' + esc(o.label || 'Time') + '">' + ui.timeOptions(o.value) + '</select>' + I('chevronDown', 'select-caret') + '</span>';
  };

  // Location input with autocomplete suggestions (cities, airport, areas — spec 6.1.1)
  ui.locationInput = function (o) {
    return '<div class="autocomplete" data-autocomplete>' + (o.icon === false ? '' : I('pin', 'autocomplete-icon')) +
      '<input class="autocomplete-input ' + (o.cls || '') + '" name="location" value="' + esc(o.value || '') + '" placeholder="' + esc(o.placeholder || 'City, airport or address') + '" autocomplete="off" aria-label="Pick-up location" required>' +
      '<div class="autocomplete-menu" role="listbox" hidden></div></div>';
  };

  // ---- overlays ------------------------------------------------------------------------------
  ui.dropdown = function (o) {
    var items = o.items.map(function (it) {
      if (it.divider) return '<div class="dropdown-divider" role="separator"></div>';
      if (it.header) return '<div class="dropdown-header">' + esc(it.header) + '</div>';
      var tag = it.href ? 'a' : 'button';
      return '<' + tag + ' class="dropdown-item' + (it.danger ? ' is-danger' : '') + (it.active ? ' is-active' : '') + '" role="menuitem"' +
        (it.href ? ' href="' + it.href + '"' : ' type="button"') + (it.toast ? ' data-toast="' + esc(it.toast) + '"' + (it.toastType ? ' data-toast-type="' + it.toastType + '"' : '') : '') +
        (it.value ? ' data-value="' + esc(it.value) + '"' : '') + (it.attrs || '') + '>' + (it.icon ? I(it.icon) : '') + '<span>' + esc(it.label) + '</span>' + (it.meta ? '<span class="dropdown-meta">' + esc(it.meta) + '</span>' : '') + '</' + tag + '>';
    }).join('');
    return '<div class="dropdown' + (o.align === 'right' ? ' dropdown-right' : '') + (o.cls ? ' ' + o.cls : '') + '" data-dropdown' + (o.select ? ' data-dropdown-select' : '') + '>' +
      o.trigger + '<div class="dropdown-menu" role="menu">' + (o.menuHead || '') + items + (o.menuFoot || '') + '</div></div>';
  };

  ui.modal = function (o) {
    return '<div class="modal' + (o.size ? ' modal-' + o.size : '') + '" id="' + o.id + '" role="dialog" aria-modal="true" aria-labelledby="' + o.id + '-title" aria-hidden="true">' +
      '<div class="modal-dialog">' +
      '<div class="modal-header"><div>' + (o.eyebrow ? '<p class="modal-eyebrow">' + esc(o.eyebrow) + '</p>' : '') + '<h2 class="modal-title" id="' + o.id + '-title">' + esc(o.title) + '</h2>' + (o.subtitle ? '<p class="modal-subtitle">' + esc(o.subtitle) + '</p>' : '') + '</div>' +
      '<button type="button" class="modal-close" data-modal-close aria-label="Close">' + I('x') + '</button></div>' +
      '<div class="modal-body">' + o.body + '</div>' +
      (o.footer ? '<div class="modal-footer">' + o.footer + '</div>' : '') +
      '</div></div>';
  };

  ui.empty = function (o) {
    return '<div class="empty' + (o.cls ? ' ' + o.cls : '') + '"' + (o.attrs || '') + '><div class="empty-icon">' + I(o.icon || 'search') + '</div>' +
      '<h3 class="empty-title">' + esc(o.title) + '</h3><p class="empty-text">' + esc(o.text) + '</p>' + (o.action || '') + '</div>';
  };

  ui.pagination = function (o) {
    var pages = o.pages <= 5 ? Array.from({ length: o.pages }, function (_, i) { return i + 1; }) : [1, 2, 3, '…', o.pages];
    var btns = pages.map(function (p) {
      if (p === '…') return '<span class="page-gap">…</span>';
      return '<button type="button" class="page-btn' + (p === (o.current || 1) ? ' is-active' : '') + '" data-page="' + p + '"' + (p === (o.current || 1) ? ' aria-current="page"' : '') + '>' + p + '</button>';
    }).join('');
    return '<nav class="pagination" aria-label="Pagination" data-pagination><p class="pagination-info">' + esc(o.info) + '</p><div class="pagination-pages">' +
      '<button type="button" class="page-btn page-prev" data-page="prev" aria-label="Previous page" disabled>' + I('chevronLeft') + '<span>Previous</span></button>' + btns +
      '<button type="button" class="page-btn page-next" data-page="next" aria-label="Next page"' + (o.pages <= 1 ? ' disabled' : '') + '><span>Next</span>' + I('chevronRight') + '</button></div></nav>';
  };

  // Responsive data table: cells carry data-label so concepts can turn rows into stacked cards on phones.
  ui.table = function (o) {
    var head = (o.select ? '<th class="col-check"><label class="check check-sm"><input type="checkbox" data-check-all aria-label="Select all"><span class="check-box">' + I('check') + '</span></label></th>' : '') +
      o.cols.map(function (c) { return '<th' + (c.cls ? ' class="' + c.cls + '"' : '') + ' scope="col">' + esc(c.label) + '</th>'; }).join('');
    var body = o.rows.map(function (r, i) {
      return '<tr' + (o.rowAttrs ? o.rowAttrs(r, i) : '') + '>' +
        (o.select ? '<td class="col-check"><label class="check check-sm"><input type="checkbox" data-check-row aria-label="Select row"><span class="check-box">' + I('check') + '</span></label></td>' : '') +
        o.cols.map(function (c) { return '<td' + (c.cls ? ' class="' + c.cls + '"' : '') + ' data-label="' + esc(c.label) + '">' + c.render(r, i) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return '<div class="table-wrap' + (o.cls ? ' ' + o.cls : '') + '"><table class="table"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table></div>';
  };

  ui.rowActions = function (code, extra) {
    return ui.dropdown({
      align: 'right', cls: 'row-menu',
      trigger: '<button type="button" class="btn btn-ghost btn-icon btn-sm" data-dropdown-toggle aria-label="Actions for ' + esc(code) + '">' + I('more') + '</button>',
      items: (extra || []).concat([
        { icon: 'eye', label: 'View details', toast: 'Opening ' + code + ' (prototype)', toastType: 'info' },
        { icon: 'message', label: 'Open chat', toast: 'Chat opens here in the real app', toastType: 'info' },
        { divider: true },
        { icon: 'xCircle', label: 'Cancel reservation', danger: true, toast: code + ' would be cancelled (prototype — nothing changed)', toastType: 'warning' }
      ])
    });
  };

  // ---- charts (single series, values labelled, hover tooltips via data-tip) --------------------
  ui.barsV = function (items, o) {
    o = o || {};
    var max = Math.max.apply(null, items.map(function (x) { return x[1]; })) * 1.12;
    var ticks = o.ticks || 4, step = max / ticks;
    var grid = '';
    for (var i = ticks; i >= 0; i--) grid += '<div class="chart-gridline"><span>' + (o.tickFmt ? o.tickFmt(step * i) : F.num(step * i)) + '</span></div>';
    var bars = items.map(function (x, i) {
      var last = i === items.length - 1;
      return '<div class="chart-col' + (last && o.highlightLast ? ' is-current' : '') + '"><div class="chart-bar" style="--h:' + (x[1] / max * 100).toFixed(1) + '%" data-tip="' + esc(x[0] + ' · ' + (o.fmt ? o.fmt(x[1]) : F.num(x[1]))) + '" tabindex="0"></div><span class="chart-x">' + esc(x[0]) + '</span></div>';
    }).join('');
    return '<div class="chart chart-v' + (o.cls ? ' ' + o.cls : '') + '" role="img" aria-label="' + esc(o.label || 'Bar chart') + '"><div class="chart-grid">' + grid + '</div><div class="chart-cols">' + bars + '</div></div>';
  };

  ui.barsH = function (items, o) {
    o = o || {};
    return '<div class="hbars' + (o.cls ? ' ' + o.cls : '') + '">' + items.map(function (x) {
      return '<div class="hbar" data-tip="' + esc(x.tip || (x.label + ' · ' + x.value)) + '" tabindex="0"><div class="hbar-head"><span class="hbar-label">' + x.label + '</span><span class="hbar-value">' + esc(x.display || x.value) + '</span></div>' +
        '<div class="hbar-track"><div class="hbar-fill" style="--w:' + Math.max(2, x.pct).toFixed(1) + '%"></div></div></div>';
    }).join('') + '</div>';
  };

  // ---- availability calendar model --------------------------------------------------------------
  function rng(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; var t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  var NAMES = ['A. Hoxha', 'K. Shehu', 'M. Rossi', 'J. Müller', 'E. Dervishi', 'D. Leka', 'S. Marku', 'L. Weber', 'B. Gjoka', 'T. Harris', 'C. Martin', 'G. Hysa', 'N. Kola', 'R. Duka', 'P. Novak', 'F. Rama'];

  ui.calendarModel = function (y, m) {
    var daysIn = new Date(y, m + 1, 0).getDate();
    var lead = (new Date(y, m, 1).getDay() + 6) % 7;  // Monday-first
    var now = D.now, days = [];
    for (var d = 1; d <= daysIn; d++) {
      var date = new Date(y, m, d), dow = (date.getDay() + 6) % 7;
      days.push({ d: d, date: date, dow: dow, weekend: dow >= 5, today: date.toDateString() === now.toDateString(), past: date < new Date(now.getFullYear(), now.getMonth(), now.getDate()) });
    }
    var cells = [];
    for (var i = 0; i < lead; i++) cells.push(null);
    days.forEach(function (x) { cells.push(x); });
    while (cells.length % 7) cells.push(null);

    var events;
    if (y === 2026 && m === 10) events = D.calendarNov2026.map(function (e) { return { v: e[0], start: e[1], end: e[2], type: e[3], label: e[4] }; });
    else {
      var r = rng(y * 12 + m + 7), n = 1060 + ((y - 2026) * 12 + m - 10) * 40;
      events = [];
      D.calendarVehicles.forEach(function (veh) {
        var cur = 1 + Math.floor(r() * 4);
        while (cur <= daysIn) {
          var len = 2 + Math.floor(r() * 5), end = Math.min(daysIn, cur + len - 1), roll = r();
          var type = roll < 0.07 ? 'service' : roll < 0.12 ? 'personal' : roll < 0.16 ? 'offline' : 'reserved';
          var label = type === 'reserved' ? 'RC-' + (n++) + ' · ' + NAMES[Math.floor(r() * NAMES.length)] : type === 'service' ? 'Service' : type === 'personal' ? 'Personal use' : 'Off-platform booking';
          events.push({ v: veh.id, start: cur, end: end, type: type, label: label });
          cur = end + 2 + Math.floor(r() * 4);
        }
      });
    }
    var model = {
      y: y, m: m, label: F.monthLabel(y, m), daysIn: daysIn, lead: lead, days: days, cells: cells,
      vehicles: D.calendarVehicles, events: events,
      eventsFor: function (vid) { return events.filter(function (e) { return e.v === vid; }); },
      eventsOn: function (day) { return events.filter(function (e) { return day >= e.start && day <= e.end; }); },
      vehicle: function (vid) { return D.calendarVehicles.filter(function (v) { return v.id === vid; })[0]; }
    };
    model.occupancy = D.calendarVehicles.map(function (veh) {
      var booked = model.eventsFor(veh.id).filter(function (e) { return e.type === 'reserved'; }).reduce(function (s, e) { return s + (e.end - e.start + 1); }, 0);
      return { vehicle: veh, days: booked, pct: booked / daysIn * 100 };
    });
    return model;
  };

  ui.CAL_TYPES = [
    { type: 'reserved', label: 'Reserved' },
    { type: 'service', label: 'Blocked · service' },
    { type: 'personal', label: 'Blocked · personal use' },
    { type: 'offline', label: 'Blocked · off-platform booking' },
    { type: 'buffer', label: 'Buffer (cleaning)' },
    { type: 'free', label: 'Available' }
  ];
  ui.calLegend = function (cls) {
    return '<ul class="cal-legend ' + (cls || '') + '" role="list">' + ui.CAL_TYPES.map(function (t) {
      return '<li><span class="cal-swatch cal-' + t.type + '"></span>' + t.label + '</li>';
    }).join('') + '</ul>';
  };

  // ---- static map (stylised Tirana: Grand Park lake, Lana river, ring road, airport road) -------
  ui.mapSvg = function () {
    var minor = '';
    for (var i = 0; i < 14; i++) minor += '<path class="map-street" d="M-20 ' + (20 + i * 46) + ' L820 ' + (40 + i * 46 + (i % 3) * 8) + '"/>';
    for (var j = 0; j < 16; j++) minor += '<path class="map-street" d="M' + (10 + j * 54) + ' -20 L' + (30 + j * 54 - (j % 4) * 6) + ' 620"/>';
    return '<svg class="map-svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
      '<rect class="map-land" width="800" height="600"/>' +
      '<path class="map-block" d="M330 180h150l20 90-30 70H340l-25-80z"/>' +
      '<path class="map-block" d="M520 380l120-30 60 90-110 50z"/><path class="map-block" d="M80 120l140-20 40 90-150 30z"/>' + minor +
      '<path class="map-park" d="M60 430c30-60 200-70 260-10 40 50 10 150-70 170-100 20-210-70-190-160z"/>' +
      '<path class="map-park" d="M372 296h56a6 6 0 0 1 6 6v34a6 6 0 0 1-6 6h-56a6 6 0 0 1-6-6v-34a6 6 0 0 1 6-6z"/>' +
      '<path class="map-park" d="M610 120c40-20 90 0 100 40s-30 70-80 60-60-80-20-100z"/>' +
      '<path class="map-water" d="M120 470c30-50 110-60 150-30 30 25 20 80-30 100-50 20-130-10-120-70z"/>' +
      '<path class="map-river" d="M-10 332c130-14 200 20 300 4s180-36 270-16 170 40 250 18"/>' +
      '<ellipse class="map-road" cx="400" cy="300" rx="300" ry="226"/>' +
      '<path class="map-road map-road-major" d="M396 -10 L408 610"/>' +
      '<path class="map-road map-road-major" d="M-10 118 L330 262"/>' +
      '<path class="map-road map-road-major" d="M472 342 L810 566"/>' +
      '<path class="map-road map-road-major" d="M520 232 L810 30"/>' +
      '<text class="map-label" x="350" y="236">QENDRA</text><text class="map-label" x="300" y="400">BLLOKU</text>' +
      '<text class="map-label" x="150" y="590">PARKU I MADH</text><text class="map-label" x="640" y="60">RINAS · TIA →</text>' +
      '<text class="map-label" x="20" y="100">← DURRËS</text><text class="map-label" x="640" y="530">ELBASAN →</text></svg>';
  };

  // Pins: one per pick-up point, showing the lowest total for the selected period (spec 6.2.3)
  ui.searchPins = function () {
    var info = RC.searchInfo(), byLoc = {};
    D.vehicles.forEach(function (v) {
      var t = RC.quote(v, info.days).total;
      if (!byLoc[v.location] || t < byLoc[v.location].min) byLoc[v.location] = { min: t, count: (byLoc[v.location] ? byLoc[v.location].count : 0) };
      byLoc[v.location].count++;
    });
    return Object.keys(byLoc).map(function (id) { var l = D.locations[id]; return { id: id, x: l.map.x, y: l.map.y, name: l.short, total: byLoc[id].min, count: byLoc[id].count }; });
  };

  ui.map = function (o) {
    o = o || {};
    var pins = (o.pins || []).map(function (p, i) {
      var price = RC.fmt.price(p.total);
      return '<button type="button" class="map-pin' + (p.id === o.active ? ' is-active' : '') + '" style="left:' + p.x + '%;top:' + p.y + '%" data-map-pin="' + p.id + '" data-tip="' + esc(p.name + ' · ' + p.count + (p.count === 1 ? ' car' : ' cars')) + '">' +
        '<span class="map-pin-label">' + esc(o.compact ? price.value : price.main) + '</span></button>';
    }).join('');
    var single = o.single ? '<span class="map-marker" style="left:' + o.single.x + '%;top:' + o.single.y + '%">' + RC.icon('pin') + '</span>' : '';
    return '<div class="map' + (o.cls ? ' ' + o.cls : '') + '">' + ui.mapSvg() + '<div class="map-pins">' + pins + single + '</div>' +
      (o.controls === false ? '' : '<div class="map-controls"><button type="button" class="map-ctrl" aria-label="Zoom in" data-toast="Map zoom is static in this prototype" data-toast-type="info">' + RC.icon('plus') + '</button><button type="button" class="map-ctrl" aria-label="Zoom out" data-toast="Map zoom is static in this prototype" data-toast-type="info">' + RC.icon('minus') + '</button></div>') +
      (o.searchToggle ? '<div class="map-search-toggle">' + ui.check({ label: 'Search as I move the map', checked: false, cls: 'check-sm' }) + '</div>' : '') +
      '<span class="map-attrib">Map preview · not to scale</span></div>';
  };

  // ---- filtering metadata for result cards ------------------------------------------------------
  ui.itemAttrs = function (v) {
    var q = RC.quote(v);
    return ' data-item data-category="' + v.category + '" data-transmission="' + v.transmission + '" data-fuel="' + v.fuel + '" data-price="' + v.price + '" data-total="' + q.total + '" data-rating="' + (v.rating || 0) + '" data-payment="' + D.providers[v.provider].payments.join(' ') + '" data-seats="' + v.seats + '"';
  };

  ui.filterCounts = function (key) {
    var c = {};
    D.vehicles.forEach(function (v) { c[v[key]] = (c[v[key]] || 0) + 1; });
    return c;
  };

  // ---- style-guide scaffolding (content is shared; the concept supplies tokens + styles) --------
  ui.styleguide = function (spec) {
    var sec = function (id, title, desc, body) {
      return '<section class="sg-section" id="sg-' + id + '"><header class="sg-head"><h2 class="sg-title">' + esc(title) + '</h2>' + (desc ? '<p class="sg-desc">' + esc(desc) + '</p>' : '') + '</header>' + body + '</section>';
    };
    var colors = spec.colors.map(function (g) {
      return '<div class="sg-color-group"><h3 class="sg-sub">' + esc(g.group) + '</h3><div class="sg-swatches">' + g.items.map(function (c) {
        return '<div class="sg-swatch"><span class="sg-chip" style="background:' + c.hex + '"></span><span class="sg-swatch-name">' + esc(c.name) + '</span><code class="sg-code">' + esc(c.hex) + '</code>' + (c.use ? '<span class="sg-swatch-use">' + esc(c.use) + '</span>' : '') + '</div>';
      }).join('') + '</div></div>';
    }).join('');
    var fonts = spec.fonts.map(function (f) {
      return '<div class="sg-font"><span class="sg-font-sample" style="font-family:' + f.css + '">' + esc(f.sample || 'Aa') + '</span><div><b>' + esc(f.family) + '</b><span>' + esc(f.role) + '</span></div></div>';
    }).join('');
    var type = spec.type.map(function (t) {
      return '<div class="sg-type-row"><span class="sg-type-meta">' + esc(t.name) + '<code>' + esc(t.meta) + '</code></span><span class="' + t.cls + '">' + esc(t.sample) + '</span></div>';
    }).join('');
    var spacing = spec.spacing.map(function (s) { return '<div class="sg-space"><span class="sg-space-bar" style="width:' + s + 'px"></span><code>' + s + 'px</code></div>'; }).join('');
    var radii = spec.radii.map(function (r) { return '<div class="sg-radius"><span class="sg-radius-box" style="border-radius:' + r[1] + '"></span><b>' + esc(r[0]) + '</b><code>' + esc(r[1]) + '</code></div>'; }).join('');
    var shadows = spec.shadows.map(function (s) { return '<div class="sg-shadow"><span class="sg-shadow-box" style="box-shadow:' + s[1] + '"></span><b>' + esc(s[0]) + '</b></div>'; }).join('');

    var buttons =
      '<div class="sg-row"><button class="btn btn-primary" type="button">Primary</button><button class="btn btn-secondary" type="button">Secondary</button><button class="btn btn-tertiary" type="button">Tertiary</button><button class="btn btn-ghost" type="button">Ghost</button><button class="btn btn-danger" type="button">Destructive</button></div>' +
      '<div class="sg-row"><button class="btn btn-primary btn-lg" type="button">' + I('search') + 'Large with icon</button><button class="btn btn-primary btn-sm" type="button">Small</button><button class="btn btn-secondary btn-icon" type="button" aria-label="Favourite" data-tip="Icon button">' + I('heart') + '</button><button class="btn btn-primary is-loading" type="button" aria-busy="true">Saving…</button><button class="btn btn-primary" type="button" disabled>Disabled</button></div>' +
      '<div class="sg-row sg-states"><button class="btn btn-primary is-hover" type="button">Hover</button><button class="btn btn-primary is-pressed" type="button">Active / pressed</button><button class="btn btn-primary is-focus" type="button">Focus</button><button class="btn btn-secondary is-hover" type="button">Secondary hover</button><button class="btn btn-primary" type="button" data-loading>Click me</button></div>';

    var inputs = '<div class="sg-form-grid">' +
      ui.input({ label: 'Full name', name: 'sg-name', placeholder: 'e.g. Arben Hoxha' }) +
      ui.input({ label: 'Email', name: 'sg-email', type: 'email', value: 'arben.hoxha@gmail', state: 'invalid', error: 'Enter a valid email address, e.g. name@example.com', icon: 'mail' }) +
      ui.input({ label: 'Phone', name: 'sg-phone', value: '69 123 4567', prefix: '+355', state: 'valid', hint: 'Used only for this booking' }) +
      ui.input({ label: 'Registration plate', name: 'sg-plate', value: 'AA 482 KL', disabled: true, hint: 'Disabled field' }) +
      ui.select({ label: 'Category', name: 'sg-cat', options: ['Economy', 'Compact', 'SUV', 'Luxury', 'Van'], value: 'SUV' }) +
      ui.input({ label: 'Password', name: 'sg-pw', type: 'password', value: 'rentcar2026', strength: true }) +
      '<div class="field"><span class="field-label">Pick-up date &amp; time</span><div class="sg-date-row">' + ui.dateInput({ name: 'sg-date', value: '2026-11-18' }) + ui.timeSelect({ name: 'sg-time', value: '10:00' }) + '</div></div>' +
      '<div class="field"><span class="field-label">Location (autocomplete)</span>' + ui.locationInput({ value: '' , placeholder: 'Try “Dur” or “Air”' }) + '</div>' +
      ui.input({ label: 'Note to the owner', name: 'sg-note', type: 'textarea', placeholder: 'Arriving on flight W6 4211 at 22:40', optional: true, rows: 3, cls: 'sg-span-2' }) +
      '</div>' +
      '<div class="sg-row sg-controls">' + ui.check({ label: 'Automatic', checked: true }) + ui.check({ label: 'Manual' }) + ui.check({ type: 'radio', name: 'sg-pay', label: 'Card online', checked: true }) + ui.check({ type: 'radio', name: 'sg-pay', label: 'Cash at pickup' }) + ui.switch({ label: 'Email promotions', checked: true }) + '</div>';

    var badges = '<div class="sg-row">' + ['Confirmed', 'In progress', 'Completed', 'Pending payment', 'Cancelled', 'No-show'].map(ui.status).join('') + '</div>' +
      '<div class="sg-row">' + ui.badge('Active', 'success') + ui.badge('Inactive', 'neutral') + ui.badge('Suspended', 'danger') + '<span class="badge badge-new">New</span>' + ui.rating({ rating: 4.8, reviews: 31 }) + ui.plate('AB 123 CD') + ui.payments({ payments: ['card', 'cash'] }) + '</div>' +
      '<div class="sg-row"><span class="chip is-active" data-chip>SUV</span><span class="chip" data-chip>Automatic</span><span class="chip" data-chip>Hybrid</span><span class="chip" data-chip>4.5+ rating</span>' + ui.availability({ availability: 'available' }) + ui.availability({ availability: 'limited' }) + '</div>';

    var tabs = '<div class="tabs" data-tabs><div class="tab-list" role="tablist"><button class="tab is-active" role="tab" data-tab="t1">Overview</button><button class="tab" role="tab" data-tab="t2">Rental rules</button><button class="tab" role="tab" data-tab="t3">Reviews <span class="tab-count">38</span></button></div>' +
      '<div class="tab-panel" data-panel="t1"><p>Tabs switch their content without reloading. This panel describes the vehicle.</p></div>' +
      '<div class="tab-panel" data-panel="t2" hidden><p>Minimum driver age 23 · Full-to-full fuel policy · 20,000 ALL deposit held at pickup.</p></div>' +
      '<div class="tab-panel" data-panel="t3" hidden><p>4.9 average from 38 verified rentals.</p></div></div>';

    var feedback = '<div class="sg-row">' +
      '<button class="btn btn-secondary" type="button" data-toast="Reservation RC-1049 confirmed">Success toast</button>' +
      '<button class="btn btn-secondary" type="button" data-toast="Card payment failed — ask the customer for another card" data-toast-type="error">Error toast</button>' +
      '<button class="btn btn-secondary" type="button" data-toast="Your search was updated" data-toast-type="info">Info toast</button>' +
      '<button class="btn btn-primary" type="button" data-modal-open="sg-modal">Open modal</button>' +
      '<span class="sg-tip-demo" tabindex="0" data-tip="Deposit is held by the owner at pickup, not by RentCar">' + I('info') + ' Hover for tooltip</span>' +
      ui.dropdown({ align: 'right', trigger: '<button class="btn btn-secondary" type="button" data-dropdown-toggle>Dropdown ' + I('chevronDown') + '</button>', items: [{ icon: 'edit', label: 'Edit vehicle', toast: 'Edit (prototype)' }, { icon: 'copy', label: 'Duplicate', toast: 'Vehicle cloned (prototype)' }, { divider: true }, { icon: 'trash', label: 'Archive', danger: true, toast: 'Archived (prototype)', toastType: 'warning' }] }) +
      '</div>' +
      '<div class="sg-alerts">' +
      '<div class="alert alert-info">' + I('info') + '<div><b>Free cancellation until 15 Nov, 10:00.</b> After that 50% of the total is charged (Moderate policy).</div></div>' +
      '<div class="alert alert-success">' + I('checkCircle') + '<div><b>Payment authorised.</b> 36,000 ALL is held on your card and captured at pickup.</div></div>' +
      '<div class="alert alert-warning">' + I('alert') + '<div><b>Upload your driving licence.</b> It is required before your first reservation can be confirmed.</div></div>' +
      '<div class="alert alert-danger">' + I('alertCircle') + '<div><b>This car is no longer available.</b> Another customer confirmed it a moment ago.</div></div>' +
      '</div>' +
      ui.modal({ id: 'sg-modal', eyebrow: 'Modal example', title: 'Block dates for VW Golf · AB 456 EF', body: '<div class="sg-form-grid">' + ui.select({ label: 'Reason', name: 'm-reason', options: ['Service', 'Personal use', 'Off-platform booking'] }) + '<div class="field"><span class="field-label">From</span>' + ui.dateInput({ name: 'm-from', value: '2026-11-17' }) + '</div>' + ui.input({ label: 'Note', name: 'm-note', placeholder: 'Annual inspection at Auto Servis Kombinat', optional: true, cls: 'sg-span-2' }) + '</div>', footer: '<button class="btn btn-tertiary" type="button" data-modal-close>Cancel</button><button class="btn btn-primary" type="button" data-modal-close data-toast="Dates blocked (prototype)">Block dates</button>' });

    var table = ui.table({
      select: true,
      cols: [
        { label: 'Reservation', render: function (r) { return '<b class="mono">' + r.code + '</b>'; } },
        { label: 'Customer', render: function (r) { return '<span class="cell-user">' + ui.avatar(r.customer, 'sm') + esc(r.customer) + '</span>'; } },
        { label: 'Vehicle', render: function (r) { return esc(r.vehicle); } },
        { label: 'Total', cls: 'num', render: function (r) { return F.all(r.total); } },
        { label: 'Status', render: function (r) { return ui.status(r.status); } },
        { label: '', cls: 'col-actions', render: function (r) { return ui.rowActions(r.code); } }
      ],
      rows: D.reservations.slice(0, 4)
    }) + ui.pagination({ info: 'Showing 1–4 of 86 reservations', pages: 22 });

    var empty = '<div class="sg-split">' + ui.empty({ icon: 'search', title: 'No cars match these filters', text: 'Try removing a filter or widening the price range.', action: '<button class="btn btn-secondary btn-sm" type="button" data-toast="Filters cleared" data-toast-type="info">Clear filters</button>' }) +
      ui.empty({ icon: 'calendar', title: 'No reservations yet', text: 'When customers book your cars they appear here, and in your calendar.', action: '<a class="btn btn-primary btn-sm" href="#/owner/fleet">Add a vehicle</a>' }) + '</div>';

    var nav = '<nav class="sg-breadcrumb breadcrumb" aria-label="Breadcrumb"><a href="#/">Home</a>' + I('chevronRight') + '<a href="#/search">Tirana</a>' + I('chevronRight') + '<span aria-current="page">Mercedes-Benz C-Class</span></nav>' +
      '<div class="sg-row">' + '<div class="segmented" data-segmented role="group" aria-label="Currency"><button type="button" class="is-active">ALL</button><button type="button">EUR</button></div>' +
      '<div class="segmented" data-segmented role="group" aria-label="View"><button type="button" class="is-active">' + I('list') + 'List</button><button type="button">' + I('map') + 'Map</button></div>' + ui.avatar('Erion Kola') + ui.avatar('Klea Shehu') + ui.avatar('Marco Rossi') + ui.avatar('Julia Müller') + '</div>';

    return '<div class="sg">' + (spec.header || '') +
      '<nav class="sg-toc" aria-label="Style guide sections">' + [['colors', 'Colour'], ['type', 'Typography'], ['tokens', 'Spacing & elevation'], ['buttons', 'Buttons'], ['forms', 'Forms'], ['badges', 'Badges & chips'], ['nav', 'Navigation'], ['tabs', 'Tabs'], ['table', 'Table & pagination'], ['feedback', 'Feedback & overlays'], ['empty', 'Empty states'], ['cards', 'Cards']].map(function (x) { return '<a href="#/styleguide" data-scroll="sg-' + x[0] + '">' + x[1] + '</a>'; }).join('') + '</nav>' +
      sec('colors', 'Colour', spec.colorNote, colors) +
      sec('type', 'Typography', spec.typeNote, '<div class="sg-fonts">' + fonts + '</div><div class="sg-type">' + type + '</div>') +
      sec('tokens', 'Spacing, radius & elevation', spec.tokenNote, '<div class="sg-token-grid"><div><h3 class="sg-sub">Spacing scale</h3>' + spacing + '</div><div><h3 class="sg-sub">Radius</h3><div class="sg-radii">' + radii + '</div></div><div><h3 class="sg-sub">Shadows</h3><div class="sg-shadows">' + shadows + '</div></div></div>') +
      sec('buttons', 'Buttons', 'Primary, secondary and tertiary variants with hover, pressed, focus, loading and disabled states.', buttons) +
      sec('forms', 'Forms & inputs', 'Labels, hints, validation states, date and time selectors, autocomplete, checkboxes, radios and switches.', inputs) +
      sec('badges', 'Status badges & chips', 'Reservation statuses follow the specification (chapter 6.9). Status is always written out, never colour alone.', badges) +
      sec('nav', 'Navigation elements', 'Breadcrumbs, segmented controls and avatars.', nav) +
      sec('tabs', 'Tabs', '', tabs) +
      sec('table', 'Table & pagination', 'On phones, rows turn into stacked cards.', table) +
      sec('feedback', 'Notifications, tooltips, dropdowns & modal', '', feedback) +
      sec('empty', 'Empty states', '', empty) +
      sec('cards', 'Cards', 'Vehicle card as used on search results.', spec.cards || '') +
      '</div>';
  };
})();
