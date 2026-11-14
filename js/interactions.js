/* Front-end-only interactions, wired through data attributes so every concept can use them with its
   own markup: dropdowns, tabs, modals, drawers, favourites, filters & sorting, date picker,
   location autocomplete, form validation, tooltips, gallery, calendar navigation and toasts.
   Nothing here talks to a server. */
window.RC = window.RC || {};

(function () {
  var D = RC.data, F = RC.fmt, doc = document;
  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function app() { return doc.getElementById('app'); }

  // ---- overlays bookkeeping -------------------------------------------------------------------
  function closeDropdowns(except) {
    $$('[data-dropdown].is-open').forEach(function (d) { if (d !== except) { d.classList.remove('is-open'); var t = $('[data-dropdown-toggle]', d); if (t) t.setAttribute('aria-expanded', 'false'); } });
  }
  function lockBody() { doc.body.classList.toggle('is-locked', !!$('.modal.is-open') || !!$('[data-lock].is-open') || !!$('.is-open[data-lock-self]')); }
  function closeModal(m) { m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); lockBody(); }
  function openModal(m, trigger) {
    m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); m._trigger = trigger; lockBody();
    var f = $('.modal-dialog input:not([type=hidden]), .modal-dialog select, .modal-dialog button:not(.modal-close)', m) || $('.modal-close', m);
    setTimeout(function () { f && f.focus({ preventScroll: true }); }, 60);
  }
  RC.openModal = function (id) { var m = doc.getElementById(id); if (m) openModal(m); };

  RC.closeOverlays = function () {
    closeDropdowns(); closePicker(); hideTip();
    $$('.modal.is-open').forEach(closeModal);
    doc.body.classList.remove('is-locked');
  };

  // ---- tooltip --------------------------------------------------------------------------------
  var tip;
  function showTip(el) {
    var text = el.getAttribute('data-tip'); if (!text) return;
    if (!tip) { tip = doc.createElement('div'); tip.className = 'rc-tooltip'; tip.setAttribute('role', 'tooltip'); doc.body.appendChild(tip); }
    tip.textContent = text; tip.classList.add('is-visible');
    var r = el.getBoundingClientRect(), tr = tip.getBoundingClientRect();
    var x = Math.min(Math.max(8, r.left + r.width / 2 - tr.width / 2), innerWidth - tr.width - 8);
    var y = r.top - tr.height - 8; var below = y < 8; if (below) y = r.bottom + 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.toggle('is-below', below);
  }
  function hideTip() { if (tip) tip.classList.remove('is-visible'); }
  doc.addEventListener('mouseover', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(t); });
  doc.addEventListener('mouseout', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t && !t.contains(e.relatedTarget)) hideTip(); });
  doc.addEventListener('focusin', function (e) { var t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(t); });
  doc.addEventListener('focusout', hideTip);
  addEventListener('scroll', hideTip, { passive: true });

  // ---- date picker ----------------------------------------------------------------------------
  var picker, pickerFor, pickerMonth;
  function closePicker() { if (picker) { picker.remove(); picker = null; if (pickerFor) pickerFor.classList.remove('is-active'); pickerFor = null; } }
  function rangeFor(btn) {
    var scope = btn.closest('form, [data-date-scope]') || app();
    var s = $('[data-range="start"]', scope), e = $('[data-range="end"]', scope);
    return { start: s, end: e };
  }
  function renderPicker() {
    var y = pickerMonth.getFullYear(), m = pickerMonth.getMonth();
    var sel = F.parse(pickerFor.getAttribute('data-value'));
    var rg = rangeFor(pickerFor);
    var rs = rg.start ? F.parse(rg.start.getAttribute('data-value')) : null, re = rg.end ? F.parse(rg.end.getAttribute('data-value')) : null;
    var lead = (new Date(y, m, 1).getDay() + 6) % 7, n = new Date(y, m + 1, 0).getDate();
    var today = new Date(D.now.getFullYear(), D.now.getMonth(), D.now.getDate());
    var minDate = pickerFor.getAttribute('data-range') === 'end' && rs ? new Date(rs.getTime() + 86400000) : today;
    var cells = '';
    for (var i = 0; i < lead; i++) cells += '<span class="dp-empty"></span>';
    for (var d = 1; d <= n; d++) {
      var dt = new Date(y, m, d), cls = 'dp-day';
      if (dt < minDate) cls += ' is-disabled';
      if (dt.getTime() === today.getTime()) cls += ' is-today';
      if (dt.getTime() === sel.getTime()) cls += ' is-selected';
      if (rs && re && dt > rs && dt < re) cls += ' is-in-range';
      if (rs && dt.getTime() === rs.getTime()) cls += ' is-range-start';
      if (re && dt.getTime() === re.getTime()) cls += ' is-range-end';
      cells += '<button type="button" class="' + cls + '" data-dp-day="' + F.iso(dt) + '"' + (dt < minDate ? ' disabled' : '') + '>' + d + '</button>';
    }
    picker.innerHTML = '<div class="dp-head"><button type="button" class="dp-nav" data-dp-step="-1" aria-label="Previous month">' + RC.icon('chevronLeft') + '</button>' +
      '<span class="dp-title">' + F.monthLabel(y, m) + '</span><button type="button" class="dp-nav" data-dp-step="1" aria-label="Next month">' + RC.icon('chevronRight') + '</button></div>' +
      '<div class="dp-week"><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span><span>Su</span></div><div class="dp-grid">' + cells + '</div>' +
      '<p class="dp-foot">' + (pickerFor.getAttribute('data-range') === 'end' ? 'Return date · minimum rental 1 day' : 'Pick-up date · book up to 12 months ahead') + '</p>';
  }
  function positionPicker() {
    if (!picker || !pickerFor) return;
    var r = pickerFor.getBoundingClientRect(), w = picker.offsetWidth, h = picker.offsetHeight;
    var x = Math.min(Math.max(8, r.left), innerWidth - w - 8), y = r.bottom + 8;
    if (y + h > innerHeight - 8 && r.top - h - 8 > 8) y = r.top - h - 8;
    picker.style.left = x + 'px'; picker.style.top = Math.max(8, y) + 'px';
  }
  function openPicker(btn) {
    closePicker(); closeDropdowns();
    pickerFor = btn; btn.classList.add('is-active');
    var v = F.parse(btn.getAttribute('data-value')); pickerMonth = new Date(v.getFullYear(), v.getMonth(), 1);
    picker = doc.createElement('div'); picker.className = 'datepicker'; picker.setAttribute('role', 'dialog'); picker.setAttribute('aria-label', 'Choose date');
    doc.body.appendChild(picker); renderPicker(); positionPicker();
  }
  function setDate(btn, iso) {
    btn.setAttribute('data-value', iso);
    var t = $('[data-date-text]', btn); if (t) t.textContent = F.dayShort(F.parse(iso));
    var hidden = btn.nextElementSibling; if (hidden && hidden.type === 'hidden') hidden.value = iso;
  }
  addEventListener('resize', positionPicker);
  addEventListener('scroll', positionPicker, { passive: true });

  // ---- autocomplete ---------------------------------------------------------------------------
  function acRender(box) {
    var input = $('input', box), menu = $('.autocomplete-menu', box), q = input.value.trim().toLowerCase();
    var list = D.places.filter(function (p) { return !q || p.name.toLowerCase().indexOf(q) >= 0 || p.type.toLowerCase().indexOf(q) >= 0; }).slice(0, 6);
    if (!list.length) { menu.innerHTML = '<div class="autocomplete-empty">No matching places in Albania</div>'; }
    else menu.innerHTML = '<div class="autocomplete-head">' + (q ? 'Suggestions' : 'Popular pick-up locations') + '</div>' + list.map(function (p, i) {
      return '<button type="button" class="autocomplete-item' + (i === 0 && q ? ' is-active' : '') + '" role="option" data-ac-value="' + RC.esc(p.name) + '">' +
        RC.icon(p.type === 'Airport' ? 'plane' : p.type === 'Port' ? 'navigation' : 'pin') + '<span><b>' + RC.esc(p.name) + '</b><small>' + RC.esc(p.sub) + '</small></span></button>';
    }).join('');
    menu.hidden = false; box.classList.add('is-open');
  }
  function acClose(box) { var m = $('.autocomplete-menu', box); if (m) m.hidden = true; box.classList.remove('is-open'); }
  doc.addEventListener('focusin', function (e) { var box = e.target.closest && e.target.closest('[data-autocomplete]'); if (box && e.target.matches('input')) acRender(box); });
  doc.addEventListener('input', function (e) { var box = e.target.closest && e.target.closest('[data-autocomplete]'); if (box) acRender(box); });
  doc.addEventListener('keydown', function (e) {
    var box = e.target.closest && e.target.closest('[data-autocomplete]'); if (!box || !e.target.matches('input')) return;
    var items = $$('.autocomplete-item', box), cur = items.findIndex(function (x) { return x.classList.contains('is-active'); });
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); if (!items.length) return;
      var next = e.key === 'ArrowDown' ? (cur + 1) % items.length : (cur - 1 + items.length) % items.length;
      items.forEach(function (x, i) { x.classList.toggle('is-active', i === next); });
    } else if (e.key === 'Enter' && cur >= 0 && !box.hidden && $('.autocomplete-menu', box).hidden === false) {
      e.preventDefault(); e.target.value = items[cur].getAttribute('data-ac-value'); acClose(box);
    } else if (e.key === 'Escape') acClose(box);
  });

  // ---- filters & sorting ----------------------------------------------------------------------
  function filterState() {
    var root = app(), st = { sets: {}, max: {}, min: {} };
    $$('[data-filter]', root).forEach(function (el) {
      var key = el.getAttribute('data-filter');
      var on = el.matches('input') ? el.checked : el.classList.contains('is-active');
      var val = el.matches('input') ? el.value : el.getAttribute('data-value');
      if (on && val) (st.sets[key] = st.sets[key] || {})[val] = true;
    });
    $$('[data-filter-max]', root).forEach(function (el) { if (+el.value < +el.max) st.max[el.getAttribute('data-filter-max')] = +el.value; });
    $$('[data-filter-min]', root).forEach(function (el) {
      var on = el.matches('input') ? el.checked : el.classList.contains('is-active');
      var val = el.matches('input') ? el.value : el.getAttribute('data-value');
      if (on && +val > 0) st.min[el.getAttribute('data-filter-min')] = +val;
    });
    return st;
  }
  var mapLoc = null; // office picked on the search map (null = all)
  function applyFilters() {
    var root = app(), results = $('[data-filter-results]', root); if (!results) return;
    var st = filterState(), shown = 0, active = mapLoc ? 1 : 0;
    if (mapLoc && !$('[data-map-pin="' + mapLoc + '"]', root)) mapLoc = null;
    Object.keys(st.sets).forEach(function (k) { active += Object.keys(st.sets[k]).length; });
    active += Object.keys(st.max).length + Object.keys(st.min).length;
    $$('[data-item]', results).forEach(function (item) {
      var ok = true;
      Object.keys(st.sets).forEach(function (k) {
        var vals = (item.getAttribute('data-' + k) || '').split(' ');
        if (!vals.some(function (v) { return st.sets[k][v]; })) ok = false;
      });
      Object.keys(st.max).forEach(function (k) { if (+item.getAttribute('data-' + k) > st.max[k]) ok = false; });
      Object.keys(st.min).forEach(function (k) { if (+item.getAttribute('data-' + k) < st.min[k]) ok = false; });
      if (mapLoc && item.getAttribute('data-loc') !== mapLoc) ok = false;
      item.hidden = !ok; if (ok) shown++;
    });
    $$('[data-filter-count]', root).forEach(function (el) { el.textContent = shown + (shown === 1 ? ' car' : ' cars'); });
    $$('[data-filter-active-count]', root).forEach(function (el) { el.textContent = active; el.hidden = !active; });
    $$('[data-filter-empty]', root).forEach(function (el) { el.hidden = shown > 0; });
    $$('[data-range-output]', root).forEach(function (el) {
      var r = $('[data-filter-max="' + el.getAttribute('data-range-output') + '"]', root); if (!r) return;
      el.textContent = +r.value >= +r.max ? 'Any price' : 'Up to ' + RC.fmt.price(+r.value).main + ' / day';
      r.style.setProperty('--fill', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
    });
  }
  RC.applyFilters = applyFilters;
  function syncFilter(el) {
    var key = el.getAttribute('data-filter'), val = el.matches('input') ? el.value : el.getAttribute('data-value');
    var on = el.matches('input') ? el.checked : el.classList.contains('is-active');
    $$('[data-filter="' + key + '"]', app()).forEach(function (o) {
      if (o === el) return;
      var ov = o.matches('input') ? o.value : o.getAttribute('data-value');
      if (ov !== val) return;
      if (o.matches('input')) o.checked = on; else { o.classList.toggle('is-active', on); o.setAttribute('aria-pressed', on); }
    });
  }
  function clearFilters() {
    var root = app();
    $$('[data-filter]', root).forEach(function (el) { if (el.matches('input')) el.checked = false; else { el.classList.remove('is-active'); el.setAttribute('aria-pressed', 'false'); } });
    $$('[data-filter-max]', root).forEach(function (el) { el.value = el.max; });
    $$('[data-filter-min]', root).forEach(function (el) { if (el.matches('input')) el.checked = el.value === '0'; else el.classList.toggle('is-active', el.getAttribute('data-value') === '0'); });
    mapLoc = null; $$('[data-map-pin]', root).forEach(function (p) { p.classList.remove('is-active'); });
    applyFilters();
  }
  function sortResults(mode) {
    var results = $('[data-filter-results]', app()); if (!results) return;
    var items = $$('[data-item]', results);
    items.sort(function (a, b) {
      if (mode === 'price') return +a.dataset.price - +b.dataset.price;
      if (mode === 'price-desc') return +b.dataset.price - +a.dataset.price;
      if (mode === 'rating') return (+b.dataset.rating || -1) - (+a.dataset.rating || -1);
      return +a.dataset.order - +b.dataset.order;
    });
    var anchor = $('[data-filter-empty]', results);
    items.forEach(function (it) { results.insertBefore(it, anchor && anchor.parentNode === results ? anchor : null); });
  }

  // ---- forms ----------------------------------------------------------------------------------
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function setFieldError(input, msg) {
    var field = input.closest('.field') || input.closest('.check') || input.parentNode;
    if (!field) return;
    field.classList.toggle('is-invalid', !!msg);
    if (msg) field.classList.remove('is-valid');
    var err = $('.field-error', field); if (err) err.textContent = msg || '';
    if (!err && field.classList.contains('check')) field.setAttribute('data-error', msg || '');
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }
  function validate(form) {
    var first = null;
    $$('input, select, textarea', form).forEach(function (el) {
      if (el.type === 'hidden' || el.disabled) return;
      var v = (el.value || '').trim(), msg = '';
      if (el.type === 'checkbox') { if (el.required && !el.checked) msg = 'Please accept to continue'; }
      else if (el.required && !v) msg = (el.closest('.field') && $('.field-label', el.closest('.field')) ? $('.field-label', el.closest('.field')).childNodes[0].textContent.trim() : 'This field') + ' is required';
      else if (v && el.type === 'email' && !EMAIL.test(v)) msg = 'Enter a valid email address, e.g. name@example.com';
      else if (v && el.minLength > 0 && v.length < el.minLength) msg = 'Use at least ' + el.minLength + ' characters';
      else if (el.getAttribute('data-match')) { var o = form.querySelector('[name="' + el.getAttribute('data-match') + '"]'); if (o && o.value !== el.value) msg = 'Passwords don’t match'; }
      if (el.type !== 'checkbox' || el.required) setFieldError(el, msg);
      if (msg && !first) first = el;
    });
    if (first) first.focus();
    return !first;
  }
  function strength(input) {
    var meter = doc.querySelector('[data-strength-for="' + input.id + '"]'); if (!meter) return;
    var v = input.value, s = 0;
    if (v.length >= 8) s++; if (/\d/.test(v)) s++; if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++; if (/[^A-Za-z0-9]/.test(v) || v.length >= 12) s++;
    meter.setAttribute('data-score', v ? s : 0);
    $('em', meter).textContent = !v ? 'Use 8+ characters with a number' : ['Too short', 'Weak', 'Fair', 'Good', 'Strong password'][s];
  }

  // ---- gallery --------------------------------------------------------------------------------
  function galleryGo(g, idx) {
    var thumbs = $$('[data-gallery-thumb]', g); if (!thumbs.length) return;
    idx = (idx + thumbs.length) % thumbs.length;
    var src = $('img', thumbs[idx]), main = $('[data-gallery-main]', g);
    if (main && src) {
      main.classList.add('is-swapping');
      setTimeout(function () { main.src = src.src; main.style.cssText = src.style.cssText; main.classList.remove('is-swapping'); }, 120);
    }
    thumbs.forEach(function (t, i) { t.classList.toggle('is-active', i === idx); t.setAttribute('aria-current', i === idx); });
    g.setAttribute('data-index', idx);
    $$('[data-gallery-count]', g).forEach(function (c) { c.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(thumbs.length).padStart(2, '0'); });
  }

  // ---- calendar -------------------------------------------------------------------------------
  function renderCalendar() {
    var root = $('[data-cal-root]', app()), d = RC.design();
    if (!root || !d.partials || !d.partials.calendar) return;
    root.innerHTML = d.partials.calendar(RC.ui.calendarModel(RC.state.cal.y, RC.state.cal.m));
  }
  RC.renderCalendar = renderCalendar;

  // ---- search ---------------------------------------------------------------------------------
  function submitSearch(form) {
    var get = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
    var s = { location: get('location').trim(), pickupDate: get('pickupDate') || RC.state.search.pickupDate, pickupTime: get('pickupTime') || RC.state.search.pickupTime, returnDate: get('returnDate') || RC.state.search.returnDate, returnTime: get('returnTime') || RC.state.search.returnTime };
    var locInput = form.querySelector('[name="location"]');
    if (!s.location) { locInput && locInput.closest('[data-autocomplete]').classList.add('is-invalid'); RC.toast('Choose a pick-up location to search', 'error'); locInput && locInput.focus(); return; }
    var a = new Date(s.pickupDate + 'T' + s.pickupTime), b = new Date(s.returnDate + 'T' + s.returnTime);
    if (b - a < 86400000) { RC.toast('Return must be at least 24 hours after pick-up', 'error'); return; }
    RC.state.search = s;
    if (RC.state.route && RC.state.route.name === 'search') { RC.render({ keepScroll: true }); RC.toast('Showing cars in ' + s.location + ' · ' + RC.searchInfo().range, 'info'); }
    else RC.go('/search');
  }

  // ---- click delegation -----------------------------------------------------------------------
  doc.addEventListener('click', function (e) {
    var t = e.target, el;

    // date picker internals
    if (picker && picker.contains(t)) {
      if ((el = t.closest('[data-dp-step]'))) { pickerMonth.setMonth(pickerMonth.getMonth() + +el.getAttribute('data-dp-step')); renderPicker(); positionPicker(); return; }
      if ((el = t.closest('[data-dp-day]'))) {
        var btn = pickerFor, iso = el.getAttribute('data-dp-day'); setDate(btn, iso);
        var rg = rangeFor(btn);
        if (btn.getAttribute('data-range') === 'start' && rg.end && F.parse(rg.end.getAttribute('data-value')) <= F.parse(iso)) {
          var nx = F.parse(iso); nx.setDate(nx.getDate() + 3); setDate(rg.end, F.iso(nx));
          closePicker(); openPicker(rg.end); return;
        }
        closePicker(); btn.focus(); return;
      }
      return;
    }
    if ((el = t.closest('[data-datepicker]'))) { e.preventDefault(); if (pickerFor === el) closePicker(); else openPicker(el); return; }
    closePicker();

    // autocomplete pick
    if ((el = t.closest('[data-ac-value]'))) {
      var box = el.closest('[data-autocomplete]'); $('input', box).value = el.getAttribute('data-ac-value'); box.classList.remove('is-invalid'); acClose(box); return;
    }
    $$('[data-autocomplete].is-open').forEach(function (b) { if (!b.contains(t)) acClose(b); });

    // dropdowns
    if ((el = t.closest('[data-dropdown-toggle]'))) {
      var dd = el.closest('[data-dropdown]'), open = !dd.classList.contains('is-open');
      closeDropdowns(dd); dd.classList.toggle('is-open', open); el.setAttribute('aria-expanded', open);
      if (open) { var menu = $('.dropdown-menu', dd); menu.classList.remove('is-flipped'); var mr = menu.getBoundingClientRect(); if (mr.right > innerWidth - 8) menu.classList.add('is-flipped'); }
      return;
    }
    var item = t.closest('.dropdown-item');
    if (item) {
      var sdd = item.closest('[data-dropdown-select]');
      if (sdd) {
        $$('.dropdown-item', sdd).forEach(function (x) { x.classList.toggle('is-active', x === item); });
        var lab = $('[data-dropdown-label]', sdd); if (lab) lab.textContent = item.textContent.trim();
        if (item.hasAttribute('data-sort-value')) sortResults(item.getAttribute('data-sort-value'));
      }
    }
    if (!t.closest('.dropdown-menu') || item) closeDropdowns();

    // modals
    if ((el = t.closest('[data-modal-open]'))) { e.preventDefault(); var m = doc.getElementById(el.getAttribute('data-modal-open')); if (m) openModal(m, el); }
    if ((el = t.closest('[data-modal-close]'))) { var mm = el.closest('.modal'); if (mm) closeModal(mm); }
    if (t.classList && t.classList.contains('modal') && t.classList.contains('is-open')) closeModal(t);

    // generic class toggles (mobile nav, drawers, list/map switch, sidebars)
    if ((el = t.closest('[data-toggle]'))) {
      var target = doc.querySelector(el.getAttribute('data-toggle')), cls = el.getAttribute('data-toggle-class') || 'is-open';
      if (target) { var on = target.classList.toggle(cls); $$('[data-toggle="' + el.getAttribute('data-toggle') + '"]').forEach(function (b) { b.setAttribute('aria-expanded', on); b.classList.toggle('is-toggled', on); }); lockBody(); }
    }
    if ((el = t.closest('[data-close]'))) { var c = doc.querySelector(el.getAttribute('data-close')); if (c) { c.classList.remove(el.getAttribute('data-toggle-class') || 'is-open'); lockBody(); } }
    if (t.hasAttribute && t.hasAttribute('data-backdrop-close')) { t.classList.remove('is-open'); lockBody(); }

    // light / dark
    if ((el = t.closest('[data-theme-toggle]'))) { RC.toggleTheme(); hideTip(); return; }

    // favourites
    if ((el = t.closest('[data-fav]'))) {
      e.preventDefault(); e.stopPropagation();
      var id = el.getAttribute('data-fav'), added = RC.toggleFav(id), v = RC.vehicle(id);
      $$('[data-fav="' + id + '"]').forEach(function (b) { b.classList.toggle('is-active', added); b.setAttribute('aria-pressed', added); });
      RC.toast(added ? v.name + ' saved to your favourites' : v.name + ' removed from favourites', added ? 'success' : 'info');
      return;
    }

    // filters, chips, segmented controls, sorting
    if ((el = t.closest('button[data-filter], [data-chip][data-filter], button[data-filter-min]'))) {
      var single = el.hasAttribute('data-filter-min');
      if (single) $$('[data-filter-min="' + el.getAttribute('data-filter-min') + '"]', app()).forEach(function (o) { if (o !== el) o.classList.remove('is-active'); });
      el.classList.toggle('is-active'); el.setAttribute('aria-pressed', el.classList.contains('is-active'));
      if (el.hasAttribute('data-filter')) syncFilter(el);
      applyFilters(); return;
    }
    if ((el = t.closest('[data-chip]'))) { el.classList.toggle('is-active'); el.setAttribute('aria-pressed', el.classList.contains('is-active')); }
    if ((el = t.closest('[data-filter-clear]'))) { clearFilters(); RC.toast('All filters cleared', 'info'); }
    if ((el = t.closest('[data-segmented] > button'))) {
      $$('button', el.parentNode).forEach(function (b) { b.classList.toggle('is-active', b === el); b.setAttribute('aria-pressed', b === el); });
      if (el.hasAttribute('data-currency')) { RC.setCurrency(el.getAttribute('data-currency')); return; }
      if (el.hasAttribute('data-view')) { var vt = doc.querySelector(el.parentNode.getAttribute('data-view-target')); if (vt) vt.setAttribute('data-view', el.getAttribute('data-view')); }
    }
    if ((el = t.closest('[data-currency]')) && !el.closest('[data-segmented]')) { RC.setCurrency(el.getAttribute('data-currency')); return; }

    // tabs (optionally filtering a list of [data-item] cards)
    if ((el = t.closest('[data-tab]'))) {
      var tabs = el.closest('[data-tabs]'), key = el.getAttribute('data-tab');
      if (tabs) {
        $$('[data-tab]', tabs).forEach(function (b) { if (b.closest('[data-tabs]') !== tabs) return; var on = b === el; b.classList.toggle('is-active', on); b.setAttribute('aria-selected', on); });
        $$('[data-panel]', tabs).forEach(function (p) { if (p.closest('[data-tabs]') !== tabs) return; p.hidden = p.getAttribute('data-panel') !== key; });
        var ft = tabs.getAttribute('data-tab-filter');
        if (ft) $$(ft + ' [data-item]').forEach(function (it) { it.hidden = key !== 'all' && it.getAttribute('data-category') !== key; });
      }
    }

    // gallery
    if ((el = t.closest('[data-gallery-thumb]'))) { var g = el.closest('[data-gallery]'); galleryGo(g, +el.getAttribute('data-gallery-thumb')); }
    if ((el = t.closest('[data-gallery-step]'))) { var g2 = el.closest('[data-gallery]'); galleryGo(g2, (+g2.getAttribute('data-index') || 0) + +el.getAttribute('data-gallery-step')); }

    // calendar
    if ((el = t.closest('[data-cal-nav]'))) {
      var a = el.getAttribute('data-cal-nav'), cal = RC.state.cal;
      if (a === 'today') { cal.y = 2026; cal.m = 10; cal.day = 14; }
      else { var dt = new Date(cal.y, cal.m + (a === 'next' ? 1 : -1), 1); cal.y = dt.getFullYear(); cal.m = dt.getMonth(); cal.day = (cal.y === 2026 && cal.m === 10) ? 14 : 1; }
      renderCalendar();
    }
    if ((el = t.closest('[data-cal-day]'))) { RC.state.cal.day = +el.getAttribute('data-cal-day'); renderCalendar(); }
    if ((el = t.closest('[data-cal-event]'))) { RC.toast(el.getAttribute('data-cal-event') + ' — details open here in the real app', 'info'); }

    // map pins filter the results list to that office's cars (click again to show all)
    if ((el = t.closest('[data-map-pin]'))) {
      var loc = el.getAttribute('data-map-pin'), name = el.getAttribute('data-tip').split(' · ')[0];
      mapLoc = mapLoc === loc ? null : loc;
      $$('[data-map-pin]').forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-map-pin') === mapLoc); });
      applyFilters();
      var layout = el.closest('.results-layout'); if (layout) layout.classList.remove('show-map');
      var hits = $$('[data-item][data-loc="' + loc + '"]:not([hidden])');
      if (mapLoc) {
        hits.forEach(function (h) { h.classList.add('is-highlight'); setTimeout(function () { h.classList.remove('is-highlight'); }, 1600); });
        var list = $('[data-filter-results]'); if (list) list.closest('.results-col').scrollIntoView({ behavior: 'smooth', block: 'start' });
        RC.toast('Showing ' + hits.length + (hits.length === 1 ? ' car' : ' cars') + ' at ' + name, 'info');
      } else RC.toast('Showing cars at all locations', 'info');
      return;
    }

    // password visibility
    if ((el = t.closest('[data-pw-toggle]'))) {
      var inp = el.parentNode.querySelector('input'), show = inp.type === 'password';
      inp.type = show ? 'text' : 'password'; el.innerHTML = RC.icon(show ? 'eyeOff' : 'eye'); el.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    }

    // tables: select all
    if ((el = t.closest('[data-check-all]'))) { $$('[data-check-row]', el.closest('table')).forEach(function (c) { c.checked = el.checked; c.closest('tr').classList.toggle('is-selected', el.checked); }); }
    if ((el = t.closest('[data-check-row]'))) el.closest('tr').classList.toggle('is-selected', el.checked);

    // pagination
    if ((el = t.closest('[data-page]')) && !el.disabled) {
      var nav = el.closest('[data-pagination]'), pages = $$('[data-page]', nav).filter(function (b) { return /^\d+$/.test(b.getAttribute('data-page')); });
      var cur = pages.findIndex(function (b) { return b.classList.contains('is-active'); }), p = el.getAttribute('data-page');
      var idx = p === 'prev' ? cur - 1 : p === 'next' ? cur + 1 : pages.indexOf(el);
      idx = Math.max(0, Math.min(pages.length - 1, idx));
      pages.forEach(function (b, i) { b.classList.toggle('is-active', i === idx); if (i === idx) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
      $('[data-page="prev"]', nav).disabled = idx === 0; $('[data-page="next"]', nav).disabled = idx === pages.length - 1;
    }

    // notifications
    if ((el = t.closest('[data-mark-read]'))) {
      $$('.notif.is-unread').forEach(function (n) { n.classList.remove('is-unread'); });
      $$('[data-unread-count]').forEach(function (n) { n.hidden = true; });
      RC.toast('All notifications marked as read', 'info');
    }

    // scroll links (style guide table of contents)
    if ((el = t.closest('[data-scroll]'))) {
      var target2 = doc.getElementById(el.getAttribute('data-scroll'));
      if (target2) { e.preventDefault(); target2.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    }
    if ((el = t.closest('[data-set-location]'))) RC.state.search.location = el.getAttribute('data-set-location');

    // loading buttons and plain toasts
    if ((el = t.closest('[data-loading]')) && !el.classList.contains('is-loading')) {
      el.classList.add('is-loading'); el.setAttribute('aria-busy', 'true');
      setTimeout(function () { el.classList.remove('is-loading'); el.removeAttribute('aria-busy'); RC.toast(el.getAttribute('data-loading') || 'Changes saved', 'success'); }, 1100);
    }
    if ((el = t.closest('[data-toast]')) && !el.hasAttribute('data-dropdown-toggle')) {
      if (el.tagName === 'A' && el.getAttribute('href') === '#') e.preventDefault();
      RC.toast(el.getAttribute('data-toast'), el.getAttribute('data-toast-type') || 'success');
    }
    if ((el = t.closest('a[href="#"]'))) e.preventDefault();
  });

  doc.addEventListener('change', function (e) {
    var t = e.target;
    if (t.matches('[data-filter], [data-filter-min]')) { if (t.hasAttribute('data-filter')) syncFilter(t); applyFilters(); }
    if (t.matches('select[data-sort]')) sortResults(t.value);
  });
  doc.addEventListener('input', function (e) {
    var t = e.target;
    if (t.matches('[data-filter-max]')) applyFilters();
    if (t.type === 'password') strength(t);
    var f = t.closest && t.closest('.field.is-invalid, .check.is-invalid'); if (f) { f.classList.remove('is-invalid'); var er = $('.field-error', f); if (er) er.textContent = ''; }
    var ac = t.closest && t.closest('[data-autocomplete].is-invalid'); if (ac) ac.classList.remove('is-invalid');
  });

  doc.addEventListener('submit', function (e) {
    var form = e.target;
    e.preventDefault();
    if (form.hasAttribute('data-search-form')) { submitSearch(form); return; }
    if (form.hasAttribute('data-validate')) {
      if (!validate(form)) { RC.toast(form.getAttribute('data-error-message') || 'Please check the highlighted fields', 'error'); return; }
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true'); }
      setTimeout(function () {
        if (btn) { btn.classList.remove('is-loading'); btn.removeAttribute('aria-busy'); }
        var target = form.getAttribute('data-success-target');
        if (target) { var s = doc.querySelector(target); if (s) { form.hidden = true; s.hidden = false; } }
        else RC.toast(form.getAttribute('data-success') || 'Done (prototype — nothing was sent)', 'success');
        if (form.hasAttribute('data-success-go')) RC.go(form.getAttribute('data-success-go'));
      }, 900);
    }
  });

  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (picker) { var f = pickerFor; closePicker(); f && f.focus(); return; }
    var m = $$('.modal.is-open').pop(); if (m) { closeModal(m); if (m._trigger) m._trigger.focus(); return; }
    if ($('[data-dropdown].is-open')) { closeDropdowns(); return; }
    $$('[data-escape-close].is-open').forEach(function (x) { x.classList.remove('is-open'); });
    lockBody();
  });

  // Header state for concepts with transparent headers over imagery
  function onScroll() { doc.documentElement.classList.toggle('is-scrolled', scrollY > 24); }
  addEventListener('scroll', onScroll, { passive: true });

  // ---- after every render ----------------------------------------------------------------------
  RC.hydrate = function (root) {
    onScroll();
    $$('form[data-validate], form[data-search-form]', root).forEach(function (f) { f.noValidate = true; });
    $$('[data-filter-results] [data-item]', root).forEach(function (it, i) { it.setAttribute('data-order', i); });
    if ($('[data-filter-results]', root)) { mapLoc = null; applyFilters(); }
    $$('[data-gallery]', root).forEach(function (g) { galleryGo(g, 0); });
    $$('input[type=password]', root).forEach(strength);
  };
})();
