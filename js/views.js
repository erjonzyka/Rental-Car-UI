/* RentCar — Modern Minimal
   A clean, trustworthy marketplace: light surfaces, one confident blue, soft elevation, generous
   whitespace. Layout signatures: hero with search card + photo collage, filter toolbar with
   list + map, Gantt availability calendar, white sidebar dashboard. */
(function () {
  var D = RC.data, F = RC.fmt, ui = RC.ui, I = RC.icon, esc = RC.esc;
  var P = function (n) { return F.price(n); };

  // ---------------------------------------------------------------------------------------------
  // Site chrome
  // ---------------------------------------------------------------------------------------------
  function logo() {
    return `<a class="logo" href="#/" aria-label="RentCar home"><span class="logo-mark">${I('logoKey')}</span><span class="logo-text">rentcar</span></a>`;
  }

  function currencyMenu() {
    var cur = RC.state.currency;
    return ui.dropdown({
      select: true, align: 'right', cls: 'currency-dd',
      trigger: `<button type="button" class="btn btn-ghost btn-sm" data-dropdown-toggle aria-label="Display currency">${I('globe')}<span data-dropdown-label>${cur}</span>${I('chevronDown', 'icon-xs')}</button>`,
      items: [
        { label: 'ALL · Albanian lek', meta: 'Base', active: cur === 'ALL', attrs: ' data-currency="ALL"' },
        { label: 'EUR · Euro', meta: '≈ estimate', active: cur === 'EUR', attrs: ' data-currency="EUR"' }
      ]
    });
  }

  function header(active) {
    var link = function (href, label, key) { return `<a href="${href}" class="${active === key ? 'is-active' : ''}">${label}</a>`; };
    return `
    <header class="site-header">
      <div class="container header-inner">
        ${logo()}
        <nav class="main-nav" aria-label="Main">
          ${link('#/search', 'Find a car', 'search')}
          <a href="#/" data-scroll="how-it-works">How it works</a>
          ${link('#/owner/overview', 'For owners', 'owner')}
          ${link('#/styleguide', 'Design system', 'styleguide')}
        </nav>
        <div class="header-actions">
          ${ui.themeToggle('btn btn-ghost btn-icon btn-sm')}
          ${currencyMenu()}
          <a class="btn btn-tertiary hide-sm" href="#/signin">Sign in</a>
          <a class="btn btn-primary hide-sm" href="#/signup">Sign up</a>
          <button type="button" class="btn btn-ghost btn-icon nav-toggle" data-toggle="#d1-mobile-nav" aria-expanded="false" aria-label="Open menu">${I('menu')}</button>
        </div>
      </div>
      <div class="mobile-nav" id="d1-mobile-nav" data-escape-close>
        <nav class="container mobile-nav-inner" aria-label="Mobile">
          <a href="#/search">${I('search')}Find a car</a>
          <a href="#/owner/overview">${I('key')}For owners</a>
          <a href="#/admin/overview">${I('shield')}Admin panel</a>
          <a href="#/styleguide">${I('layers')}Design system</a>
          <div class="mobile-nav-actions"><a class="btn btn-secondary" href="#/signin">Sign in</a><a class="btn btn-primary" href="#/signup">Create account</a></div>
        </nav>
      </div>
    </header>`;
  }

  function footer() {
    var col = function (title, links) { return `<div class="footer-col"><h3>${title}</h3><ul role="list">${links.map(function (l) { return `<li><a href="${l[1] || '#'}"${l[1] ? '' : ' data-toast="Page not included in this prototype" data-toast-type="info"'}>${l[0]}</a></li>`; }).join('')}</ul></div>`; };
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-top">
          <div class="footer-brand">
            ${logo()}
            <p>The car rental marketplace for Albania — compare cars from local companies and private owners, and book in minutes.</p>
            <ul class="footer-contact" role="list">
              <li>${I('phone')}<a href="#">+355 69 123 4567</a></li>
              <li>${I('mail')}<a href="#">support@rentcar.al</a></li>
              <li>${I('pin')}Rr. Ibrahim Rugova 5, Tirana</li>
            </ul>
          </div>
          ${col('Rent a car', [['Tirana', '#/search'], ['Durrës', '#/search'], ['Vlorë', '#/search'], ['Sarandë', '#/search'], ['Tirana Airport (TIA)', '#/search']])}
          ${col('For owners', [['List your car', '#/signup'], ['Owner dashboard', '#/owner/overview'], ['Commission & payouts'], ['Owner FAQ']])}
          ${col('Support', [['Help centre'], ['Cancellation policies'], ['Contact us'], ['Admin panel', '#/admin/overview']])}
          ${col('Company', [['About RentCar'], ['Careers'], ['Press'], ['Design system', '#/styleguide']])}
        </div>
        <div class="footer-bottom">
          <p>© 2026 RentCar sh.p.k. · All prices in ALL; EUR amounts are estimates at 1 € = ${D.eurRate.toFixed(2)} ALL.</p>
          <div class="footer-pay"><span>${I('card')}Card via POK</span><span>${I('cash')}Cash at pick-up</span></div>
          <div class="footer-legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Cookies</a></div>
        </div>
      </div>
    </footer>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Shared customer components
  // ---------------------------------------------------------------------------------------------
  function searchForm(variant) {
    var s = RC.state.search;
    return `
    <form class="search-form search-${variant}" data-search-form autocomplete="off">
      <div class="search-field search-field-loc">
        <span class="search-label">Pick-up location</span>
        ${ui.locationInput({ value: s.location })}
      </div>
      <div class="search-field">
        <span class="search-label">Pick-up</span>
        <div class="search-dt">${ui.dateInput({ name: 'pickupDate', value: s.pickupDate, range: 'start', label: 'Pick-up date' })}${ui.timeSelect({ name: 'pickupTime', value: s.pickupTime, label: 'Pick-up time' })}</div>
      </div>
      <div class="search-field">
        <span class="search-label">Return</span>
        <div class="search-dt">${ui.dateInput({ name: 'returnDate', value: s.returnDate, range: 'end', label: 'Return date' })}${ui.timeSelect({ name: 'returnTime', value: s.returnTime, label: 'Return time' })}</div>
      </div>
      <button type="submit" class="btn btn-primary btn-lg search-submit">${I('search')}<span>Search cars</span></button>
    </form>`;
  }

  function specs(v) {
    return `<ul class="specs" role="list"><li>${I('gearbox')}${v.transmission}</li><li>${I('seat')}${v.seats} seats</li><li>${I(v.fuel === 'Hybrid' ? 'leaf' : 'fuel')}${v.fuel}</li></ul>`;
  }

  function vcard(v) {
    var p = P(v.price), loc = RC.location(v.location);
    return `
    <article class="vcard"${ui.itemAttrs(v)}>
      <a class="vcard-media" href="#/vehicle/${v.id}" tabindex="-1">${ui.img(v.image, v.name)}${v.badge ? `<span class="media-badge">${v.badge}</span>` : ''}</a>
      <button type="button" class="fav-btn${RC.isFav(v.id) ? ' is-active' : ''}" data-fav="${v.id}" aria-pressed="${RC.isFav(v.id)}" aria-label="Save ${esc(v.name)}">${I('heart')}</button>
      <div class="vcard-body">
        <div class="vcard-top"><span class="vcard-cat">${v.category}</span>${ui.rating(v)}</div>
        <h3 class="vcard-title"><a href="#/vehicle/${v.id}">${v.name}</a></h3>
        <p class="vcard-trim">${v.trim} · ${v.year}</p>
        ${specs(v)}
        <div class="vcard-foot">
          <div class="price"><b>${p.main}</b><span>/ day</span></div>
          <span class="vcard-loc">${I('pin')}${loc.short}</span>
        </div>
      </div>
    </article>`;
  }

  function resultCard(v) {
    var q = RC.quote(v), info = RC.searchInfo(), loc = RC.location(v.location), pr = RC.provider(v.provider), tot = P(q.total), day = P(v.price);
    return `
    <article class="rcard" data-loc="${v.location}"${ui.itemAttrs(v)}>
      <a class="rcard-media" href="#/vehicle/${v.id}" tabindex="-1">${ui.img(v.image, v.name)}${v.badge ? `<span class="media-badge">${v.badge}</span>` : ''}</a>
      <button type="button" class="fav-btn${RC.isFav(v.id) ? ' is-active' : ''}" data-fav="${v.id}" aria-pressed="${RC.isFav(v.id)}" aria-label="Save ${esc(v.name)}">${I('heart')}</button>
      <div class="rcard-main">
        <div class="rcard-head">
          <div>
            <span class="vcard-cat">${v.category}</span>
            <h3 class="rcard-title"><a href="#/vehicle/${v.id}">${v.name}</a></h3>
            <p class="vcard-trim">${v.trim} · ${v.year}</p>
          </div>
          ${ui.rating(v, { long: true })}
        </div>
        ${specs(v)}
        <div class="rcard-meta">
          <span class="rcard-provider">${ui.avatar(pr.name, 'xs')}${pr.name}<em>${pr.type}</em></span>
          <span class="rcard-loc">${I('pin')}${loc.short} · ${loc.distance}</span>
        </div>
        <div class="rcard-tags">${ui.availability(v)}${ui.payments(pr)}</div>
      </div>
      <div class="rcard-price">
        <div class="price-total"><b>${tot.main}</b><span>total for ${info.days} days</span></div>
        <div class="price-day">${day.main} / day · <span class="muted">${tot.alt}</span></div>
        <a class="btn btn-primary btn-block" href="#/vehicle/${v.id}">View details</a>
      </div>
    </article>`;
  }

  function sectionHead(title, sub, aside) {
    return `<div class="section-head"><div><h2 class="h2">${title}</h2>${sub ? `<p class="section-sub">${sub}</p>` : ''}</div>${aside || ''}</div>`;
  }

  // ---------------------------------------------------------------------------------------------
  // Home
  // ---------------------------------------------------------------------------------------------
  function home() {
    var featured = ['mercedes-c', 'kia-sportage', 'vw-golf', 'toyota-yaris', 'bmw-3', 'toyota-corolla', 'dacia-duster', 'mercedes-v'].map(RC.vehicle);
    var kia = RC.vehicle('kia-sportage');
    return `${header('home')}
    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <span class="eyebrow-pill"><span class="pulse"></span>1,027 cars from 184 local providers</span>
            <h1 class="display">Rent the right car, from people you can trust.</h1>
            <p class="lead">Compare cars from rental companies and private owners across Albania. See the full price upfront, pay by card or in cash, and pick up in minutes.</p>
            ${searchForm('hero')}
            <ul class="hero-trust" role="list">
              <li>${I('star')}<b>4.8</b> average rating</li>
              <li>${I('shieldCheck')}Clear rules on every car</li>
              <li>${I('tag')}No booking fees</li>
            </ul>
          </div>
          <div class="hero-visual" aria-hidden="true">
            <div class="hero-photo">${ui.img('assets/images/cars/bmw-x5.jpg', '')}</div>
            <div class="float-card float-car">
              ${ui.img(kia.image, '')}
              <div><b>Kia Sportage</b><span>SUV · Automatic · 5 seats</span><strong>${P(kia.price).main}<small> / day</small></strong></div>
            </div>
            <div class="float-card float-confirm">
              <span class="float-icon">${I('check')}</span>
              <div><b>Reservation confirmed</b><span>RC-1048 · Pick-up Wed 18 Nov, 10:00</span></div>
            </div>
            <div class="float-card float-rating">${ui.stars(5, 'sm')}<span>“Pick-up took five minutes.”</span></div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHead('Browse by category', 'From city runabouts to eight-seat vans — prices per day, before any long-rental discount.')}
          <div class="cat-grid">
            ${D.categories.map(function (c) {
              return `<a class="cat-card" href="#/search"><span class="cat-icon">${I(c.icon)}</span><span class="cat-name">${c.label}</span><span class="cat-blurb">${c.blurb}</span><span class="cat-meta"><b>from ${P(c.from).main}</b><span>${c.count} cars</span></span></a>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section section-muted">
        <div class="container">
          <div class="tabs" data-tabs data-tab-filter="#d1-featured">
            ${sectionHead('Featured cars this week', 'Highly rated, instantly confirmed and available for your dates.', `
              <div class="tab-list tab-pills" role="tablist">
                <button class="tab is-active" role="tab" data-tab="all">All</button><button class="tab" role="tab" data-tab="SUV">SUV</button><button class="tab" role="tab" data-tab="Compact">Compact</button><button class="tab" role="tab" data-tab="Luxury">Luxury</button><button class="tab" role="tab" data-tab="Economy">Economy</button>
              </div>`)}
          </div>
          <div class="vcard-grid" id="d1-featured">${featured.map(vcard).join('')}</div>
          <div class="center-row"><a class="btn btn-secondary" href="#/search">View all 12 cars in Tirana ${I('arrowRight')}</a></div>
        </div>
      </section>

      <section class="section" id="how-it-works">
        <div class="container">
          ${sectionHead('How it works', 'Three steps, no waiting for approval — reservations are confirmed instantly.')}
          <ol class="steps" role="list">
            <li class="step"><span class="step-num">1</span><span class="step-icon">${I('search')}</span><h3>Search & compare</h3><p>Pick a city, the airport or a neighbourhood and your dates. Filter by category, gearbox, fuel and price.</p></li>
            <li class="step"><span class="step-num">2</span><span class="step-icon">${I('calendarCheck')}</span><h3>Book instantly</h3><p>Review the total price, rules and cancellation policy, then confirm. Pay by card online or choose cash at pick-up.</p></li>
            <li class="step"><span class="step-num">3</span><span class="step-icon">${I('key')}</span><h3>Pick up & drive</h3><p>Show your driving licence at the pick-up point and get the keys. Chat with the owner any time in the app.</p></li>
          </ol>
        </div>
      </section>

      <section class="section section-muted">
        <div class="container benefits">
          <div class="benefits-media">
            ${ui.img('assets/images/places/tirana.jpg', 'Skanderbeg Square, Tirana')}
            <div class="benefits-stat"><b>12,904</b><span>rentals completed on RentCar</span></div>
          </div>
          <div class="benefits-copy">
            <h2 class="h2">Why people book with RentCar</h2>
            <p class="section-sub">Built for travellers and locals alike, with the details you need before you commit.</p>
            <div class="benefit-list">
              <div class="benefit">${I('receipt')}<div><h3>The full price, upfront</h3><p>Totals for your exact dates, including long-rental discounts. EUR is shown as an estimate.</p></div></div>
              <div class="benefit">${I('wallet')}<div><h3>Card or cash</h3><p>Pay securely online through POK, or in cash at pick-up where the owner accepts it.</p></div></div>
              <div class="benefit">${I('shieldCheck')}<div><h3>Rules before you book</h3><p>Minimum age, deposit, fuel policy and insurance are listed on every car.</p></div></div>
              <div class="benefit">${I('star')}<div><h3>Reviews from real rentals</h3><p>Only customers who completed a rental can review it, so ratings stay honest.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          ${sectionHead('Popular pick-up places', '', '<a class="link-arrow" href="#/search">All locations ' + I('arrowRight') + '</a>')}
          <div class="dest-grid">
            ${[['Tirana', 'tirana.jpg', '412 cars'], ['Durrës', 'durres.jpg', '168 cars'], ['Vlorë', 'vlore.jpg', '121 cars'], ['Sarandë', 'ksamil.jpg', '94 cars']].map(function (d) {
              return `<a class="dest-card" href="#/search" data-set-location="${d[0]}">${ui.img('assets/images/places/' + d[1], d[0])}<span class="dest-meta"><b>${d[0]}</b><span>${d[2]}</span></span></a>`;
            }).join('')}
          </div>
        </div>
      </section>

      <section class="section section-tight">
        <div class="container">
          <div class="owner-cta">
            <div>
              <span class="eyebrow">For rental companies & private owners</span>
              <h2 class="h2">Put your cars in front of thousands of travellers</h2>
              <p>List for free, set your own prices and rules, and manage reservations, locations and your calendar from one dashboard.</p>
              <div class="cta-actions"><a class="btn btn-light" href="#/signup">Become a provider</a><a class="btn btn-outline-light" href="#/owner/overview">Preview the dashboard ${I('arrowRight')}</a></div>
            </div>
            <ul class="owner-cta-points" role="list">
              <li>${I('check')}Reservations confirmed instantly — no manual approval</li>
              <li>${I('check')}Card payments split automatically through POK</li>
              <li>${I('check')}Block dates for service or personal use</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
    ${footer()}`;
  }

  // ---------------------------------------------------------------------------------------------
  // Search results
  // ---------------------------------------------------------------------------------------------
  function filterMenu(label, key, body, icon) {
    return ui.dropdown({
      cls: 'filter-dd',
      trigger: `<button type="button" class="filter-btn" data-dropdown-toggle>${icon ? I(icon) : ''}${label}${I('chevronDown', 'icon-xs')}</button>`,
      items: [], menuHead: `<div class="filter-pop"><p class="filter-pop-title">${label}</p>${body}</div>`
    });
  }

  function search() {
    var info = RC.searchInfo(), counts = ui.filterCounts('category'), tc = ui.filterCounts('transmission'), fc = ui.filterCounts('fuel');
    var checks = function (key, obj) { return Object.keys(obj).map(function (k) { return ui.check({ label: k, value: k, filter: key, count: obj[k] }); }).join(''); };
    var max = 20000;
    return `${header('search')}
    <main class="search-page">
      <div class="search-summary">
        <div class="container-wide summary-inner">
          <div class="summary-text">
            <span class="summary-loc">${I('pin')}<b>${esc(info.location)}</b></span>
            <span class="summary-dates">${I('calendar')}${info.pickupLabel} <span class="arrow">→</span> ${info.returnLabel}</span>
            <span class="summary-days">${info.days} days</span>
          </div>
          <button type="button" class="btn btn-secondary btn-sm" data-toggle="#d1-edit-search" aria-expanded="false">${I('edit')}Edit search</button>
        </div>
        <div class="edit-search" id="d1-edit-search"><div class="container-wide">${searchForm('inline')}</div></div>
      </div>

      <div class="container-wide filter-toolbar" role="toolbar" aria-label="Filters">
        <div class="filter-scroll">
          ${filterMenu('Price', 'price', `<input type="range" class="range" min="3000" max="${max}" step="500" value="${max}" data-filter-max="price" aria-label="Maximum price per day"><div class="range-scale"><span>${P(3000).main}</span><span>${P(max).main}+</span></div><p class="range-out" data-range-output="price"></p>`, 'tag')}
          ${filterMenu('Category', 'category', checks('category', counts))}
          ${filterMenu('Transmission', 'transmission', checks('transmission', tc))}
          ${filterMenu('Fuel type', 'fuel', checks('fuel', fc))}
          ${filterMenu('Rating', 'rating', [['0', 'Any rating'], ['4.5', '4.5 and above'], ['4.8', '4.8 and above']].map(function (r, i) { return ui.check({ type: 'radio', name: 'd1-rating', value: r[0], label: r[1], checked: i === 0 }).replace('type="radio"', 'type="radio" data-filter-min="rating"'); }).join(''))}
          <button type="button" class="filter-btn" data-filter="payment" data-value="card" aria-pressed="false">${I('card')}Card payment</button>
          <button type="button" class="filter-btn" data-filter="transmission" data-value="Automatic" aria-pressed="false">Automatic</button>
          <button type="button" class="filter-clear" data-filter-clear>Clear all <span class="count-dot" data-filter-active-count hidden>0</span></button>
        </div>
        <div class="toolbar-right">
          ${ui.dropdown({ select: true, align: 'right', trigger: `<button type="button" class="btn btn-ghost btn-sm" data-dropdown-toggle>${I('sort')}<span class="hide-xs">Sort:</span> <span data-dropdown-label>Recommended</span>${I('chevronDown', 'icon-xs')}</button>`, items: [{ label: 'Recommended', active: true, attrs: ' data-sort-value="recommended"' }, { label: 'Lowest price', attrs: ' data-sort-value="price"' }, { label: 'Highest rating', attrs: ' data-sort-value="rating"' }] })}
        </div>
      </div>

      <div class="container-wide results-layout" id="d1-results">
        <section class="results-col" aria-label="Results">
          <div class="results-head"><h1 class="h3"><span data-filter-count>12 cars</span> in ${esc(info.location)}</h1><p class="muted">Total prices for ${info.days} days · ${info.range}</p></div>
          <div class="results-list" data-filter-results>
            ${D.vehicles.map(resultCard).join('')}
            ${ui.empty({ icon: 'search', title: 'No cars match these filters', text: 'Try removing a filter or raising your maximum price.', action: '<button class="btn btn-secondary btn-sm" type="button" data-filter-clear>Clear all filters</button>', attrs: ' data-filter-empty hidden' })}
          </div>
          <p class="results-end">You’ve seen all cars available for these dates.</p>
        </section>
        <aside class="results-map" aria-label="Map">
          <div class="map-sticky">
            ${ui.map({ pins: ui.searchPins(), searchToggle: true })}
            <button type="button" class="btn btn-secondary map-close" data-toggle="#d1-results" data-toggle-class="show-map">${I('list')}Show list</button>
          </div>
        </aside>
        <button type="button" class="btn btn-dark map-fab" data-toggle="#d1-results" data-toggle-class="show-map">${I('map')}Map</button>
      </div>
    </main>
    ${footer()}`;
  }

  // ---------------------------------------------------------------------------------------------
  // Vehicle details
  // ---------------------------------------------------------------------------------------------
  function vehicle(route) {
    var v = RC.vehicle(route.params.id), pr = RC.provider(v.provider), loc = RC.location(v.location), info = RC.searchInfo(), q = RC.quote(v);
    var g = v.gallery;
    var rules = [
      ['user', 'Minimum driver age', v.minAge + ' years'],
      ['award', 'Driving licence held', 'At least ' + v.licenseYears + (v.licenseYears === 1 ? ' year' : ' years')],
      ['fuel', 'Fuel policy', v.fuelPolicy + ' — return with a full tank'],
      ['shield', 'Insurance included', v.insurance],
      ['wallet', 'Security deposit', F.all(v.deposit) + ' (' + F.eur(v.deposit) + ') · held at pick-up by the owner'],
      ['users', 'Additional driver', v.extraDriver]
    ];
    return `${header('search')}
    <main class="detail-page">
      <div class="container">
        <nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/">Home</a>${I('chevronRight')}<a href="#/search">Cars in ${esc(info.location)}</a>${I('chevronRight')}<span aria-current="page">${v.name}</span></nav>
        <div class="detail-head">
          <div>
            <span class="vcard-cat">${v.category} · ${v.year}</span>
            <h1 class="h1">${v.name} <span class="trim">${v.trim}</span></h1>
            <div class="detail-meta">${ui.rating(v, { long: true })}<span>${I('pin')}${loc.name}, ${loc.city}</span><span>${I('building')}${pr.name}</span></div>
          </div>
          <div class="detail-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-toast="Link copied to clipboard (prototype)">${I('share')}Share</button>
            <button type="button" class="btn btn-secondary btn-sm fav-text${RC.isFav(v.id) ? ' is-active' : ''}" data-fav="${v.id}" aria-pressed="${RC.isFav(v.id)}">${I('heart')}Save</button>
          </div>
        </div>

        <div class="gallery" data-gallery>
          <button type="button" class="gallery-main" data-modal-open="d1-photos">${ui.galleryImg(g[0], v.name, '')}</button>
          ${g.slice(1, 5).map(function (x, i) { return `<button type="button" class="gallery-thumb" data-modal-open="d1-photos" aria-label="Photo ${i + 2}">${ui.galleryImg(x, '', '')}</button>`; }).join('')}
          <button type="button" class="btn btn-secondary btn-sm gallery-all" data-modal-open="d1-photos">${I('grid')}Show all ${g.length} photos</button>
        </div>

        <div class="detail-layout">
          <div class="detail-main">
            <ul class="spec-grid" role="list">
              <li>${I('gearbox')}<span>Transmission</span><b>${v.transmission}</b></li>
              <li>${I('fuel')}<span>Fuel</span><b>${v.fuel}</b></li>
              <li>${I('seat')}<span>Seats</span><b>${v.seats}</b></li>
              <li>${I('door')}<span>Doors</span><b>${v.doors}</b></li>
              <li>${I('bag')}<span>Luggage</span><b>${v.bags} bags</b></li>
              <li>${I('car')}<span>Colour</span><b>${v.color}</b></li>
            </ul>

            <section class="detail-section"><h2 class="h3">About this car</h2><p class="prose">${v.description}</p></section>

            <section class="detail-section"><h2 class="h3">Equipment</h2>
              <ul class="equip-list" role="list">${v.equipment.map(function (k) { var e = D.equipment[k]; return `<li>${I(e[0])}${e[1]}</li>`; }).join('')}</ul>
            </section>

            <section class="detail-section"><h2 class="h3">Rental rules</h2>
              <p class="muted">Set by ${pr.name} and checked at the pick-up point.</p>
              <dl class="rules">${rules.map(function (r) { return `<div class="rule">${I(r[0])}<dt>${r[1]}</dt><dd>${r[2]}</dd></div>`; }).join('')}</dl>
              <div class="alert alert-info">${I('info')}<div><b>${pr.policy} cancellation policy.</b> ${D.cancellationPolicies[pr.policy]} Cash bookings can always be cancelled for free.</div></div>
            </section>

            <section class="detail-section"><h2 class="h3">Pick-up & return</h2>
              <div class="pickup-card">
                ${ui.map({ single: { x: 50, y: 50 }, controls: false, cls: 'map-small' })}
                <div class="pickup-info">
                  <h3>${loc.name}</h3><p>${loc.address}</p>
                  <dl class="hours">${loc.hours.map(function (h) { return `<div><dt>${h[0]}</dt><dd>${h[1]}</dd></div>`; }).join('')}</dl>
                  <p class="pickup-note">${I('info')}${loc.instructions}</p>
                  <p class="pickup-note">${I('phone')}The owner’s phone number is shared once your reservation is confirmed. Return to the same location.</p>
                </div>
              </div>
            </section>

            <section class="detail-section provider-card">
              ${ui.avatar(pr.name, 'lg')}
              <div class="provider-info"><h3>${pr.name}</h3><p>${pr.type === 'Business' ? 'Rental company' : 'Private owner'} · on RentCar since ${pr.since} · ${pr.cars} cars</p>
                <div class="provider-stats"><span>${I('star')}<b>${pr.rating}</b> provider rating (${pr.reviews})</span><span>${I('clock')}${pr.responds}</span><span>${ui.payments(pr)}</span></div></div>
              <button type="button" class="btn btn-secondary btn-sm" data-toast="Chat with the owner opens after booking" data-toast-type="info">${I('message')}Contact</button>
            </section>

            <section class="detail-section" id="reviews"><div class="reviews-head"><h2 class="h3">Reviews</h2>${ui.rating(v, { long: true })}</div>
              <div class="review-summary">
                <div class="review-score"><b>${v.rating ? v.rating.toFixed(1) : '–'}</b>${ui.stars(v.rating)}<span>${v.reviews} reviews</span></div>
                <div class="review-bars">${D.ratingBreakdown.map(function (r) { return `<div class="review-bar"><span>${r[0]} ★</span><span class="bar"><span style="width:${r[1] / 38 * 100}%"></span></span><span>${r[1]}</span></div>`; }).join('')}</div>
              </div>
              <div class="review-list">${D.reviews.map(function (r) {
                return `<article class="review">${ui.avatar(r.name)}<div class="review-body"><div class="review-top"><b>${r.name}</b><span class="muted">${r.date}</span>${r.edited ? '<span class="badge badge-neutral">Edited</span>' : ''}</div>${ui.stars(r.rating, 'sm')}<p>${r.text}</p>${r.reply ? `<div class="review-reply"><b>Response from ${pr.name}</b><p>${r.reply}</p></div>` : ''}</div></article>`;
              }).join('')}</div>
              <button type="button" class="btn btn-secondary" data-toast="All reviews would load here" data-toast-type="info">Show all ${v.reviews} reviews</button>
            </section>
          </div>

          <aside class="detail-aside">
            ${bookingCard(v, q, info, pr)}
          </aside>
        </div>
      </div>

      <div class="mobile-book">
        <div><b>${P(q.total).main}</b><span>${info.days} days · ${info.range}</span></div>
        <button type="button" class="btn btn-primary" data-modal-open="d1-reserve">Reserve</button>
      </div>

      ${ui.modal({ id: 'd1-photos', size: 'xl', title: v.name + ' · ' + g.length + ' photos', body: `<div class="photo-grid">${g.map(function (x) { return `<figure>${ui.galleryImg(x, v.name)}</figure>`; }).join('')}</div>` })}
      ${reserveModal(v, q, info, pr)}
    </main>
    ${footer()}`;
  }

  function bookingCard(v, q, info, pr) {
    return `
    <div class="booking-card">
      <div class="booking-price"><b>${P(v.price).main}</b><span>/ day</span></div>
      <form class="booking-dates" data-date-scope>
        <div class="booking-field"><span>Pick-up</span>${ui.dateInput({ name: 'bpd', value: RC.state.search.pickupDate, range: 'start', icon: false })}${ui.timeSelect({ name: 'bpt', value: info.pickupTime, icon: false })}</div>
        <div class="booking-field"><span>Return</span>${ui.dateInput({ name: 'brd', value: RC.state.search.returnDate, range: 'end', icon: false })}${ui.timeSelect({ name: 'brt', value: info.returnTime, icon: false })}</div>
      </form>
      <p class="booking-loc">${I('pin')}${RC.location(v.location).name}</p>
      <fieldset class="pay-choice"><legend>Payment</legend>
        ${pr.payments.indexOf('card') >= 0 ? ui.check({ type: 'radio', name: 'd1-pay', label: '<b>Card online</b><small>Amount held now, charged at pick-up</small>', checked: true, cls: 'pay-option' }) : ''}
        ${ui.check({ type: 'radio', name: 'd1-pay', label: '<b>Cash at pick-up</b><small>Pay the owner when you collect the car</small>', checked: pr.payments.indexOf('card') < 0, cls: 'pay-option' })}
      </fieldset>
      <dl class="price-lines">
        <div><dt>${P(v.price).main} × ${q.days} days</dt><dd>${P(q.base).main}</dd></div>
        <div><dt>Long-rental discount <span class="muted">(7+ days)</span></dt><dd>${q.discount ? '−' + P(q.discount).main : '—'}</dd></div>
        <div><dt>Booking fee</dt><dd>Free</dd></div>
        <div class="price-total-line"><dt>Total</dt><dd>${P(q.total).main}<small>${P(q.total).alt}</small></dd></div>
      </dl>
      <button type="button" class="btn btn-primary btn-lg btn-block" data-modal-open="d1-reserve">Reserve</button>
      <p class="booking-note">${I('shieldCheck')}Confirmed instantly · Deposit of ${F.all(v.deposit)} held at pick-up</p>
    </div>`;
  }

  function reserveModal(v, q, info, pr) {
    return ui.modal({
      id: 'd1-reserve', title: 'Confirm your reservation', subtitle: 'Review the details — the owner confirms nothing manually, your car is reserved instantly.',
      body: `
      <form data-validate data-success-target="#d1-reserve-done" id="d1-reserve-form">
        <div class="confirm-car">${ui.img(v.image, v.name)}<div><b>${v.name}</b><span>${v.trim}</span><span>${I('pin')}${RC.location(v.location).name}</span></div></div>
        <dl class="confirm-lines">
          <div><dt>Pick-up</dt><dd>${info.pickupLabel}</dd></div><div><dt>Return</dt><dd>${info.returnLabel}</dd></div>
          <div><dt>Duration</dt><dd>${q.days} days</dd></div><div><dt>Payment</dt><dd>Card online (POK, 3-D Secure)</dd></div>
          <div><dt>Cancellation</dt><dd>${pr.policy}</dd></div><div class="strong"><dt>Total</dt><dd>${P(q.total).main} <small>${P(q.total).alt}</small></dd></div>
        </dl>
        ${ui.check({ label: 'I accept the car’s rental rules and the RentCar booking terms', required: true, name: 'accept' })}
        <p class="field-error check-error"></p>
        <div class="modal-actions"><button type="button" class="btn btn-tertiary" data-modal-close>Back</button><button type="submit" class="btn btn-primary">${I('lock')}Confirm & pay ${P(q.total).main}</button></div>
      </form>
      <div class="success-state" id="d1-reserve-done" hidden>
        <span class="success-icon">${I('check')}</span>
        <h3>Reservation RC-1049 confirmed</h3>
        <p>We’ve emailed the details, the pick-up address and the owner’s phone number. ${P(q.total).main} is held on your card and charged at pick-up.</p>
        <div class="modal-actions center"><button type="button" class="btn btn-secondary" data-modal-close>Close</button><a class="btn btn-primary" href="#/">Back to home</a></div>
      </div>`
    });
  }

  // ---------------------------------------------------------------------------------------------
  // Authentication
  // ---------------------------------------------------------------------------------------------
  function authShell(inner, title) {
    return `
    <main class="auth-page">
      <div class="auth-top">${logo()}<a class="btn btn-ghost btn-sm" href="#/">${I('arrowLeft')}Back to site</a></div>
      <div class="auth-card">${inner}</div>
      <p class="auth-foot">Protected by industry-standard encryption · <a href="#">Privacy</a> · <a href="#">Terms</a></p>
    </main>`;
  }
  function roleSwitch() {
    return `<div class="segmented segmented-block" data-segmented role="group" aria-label="Account type"><button type="button" class="is-active">${I('user')}Customer</button><button type="button">${I('key')}Rental provider</button></div>`;
  }

  function signin() {
    return authShell(`
      <h1 class="auth-title">Welcome back</h1>
      <p class="auth-sub">Sign in to manage your reservations and favourites.</p>
      ${roleSwitch()}
      <button type="button" class="btn btn-secondary btn-block btn-google" data-toast="Google sign-in is not connected in this prototype" data-toast-type="info">${RC.googleLogo}Continue with Google</button>
      <div class="divider"><span>or with email</span></div>
      <form data-validate data-success="Signed in (prototype)" data-success-go="/owner/overview" novalidate>
        ${ui.input({ label: 'Email', name: 'email', type: 'email', placeholder: 'name@example.com', required: true, autocomplete: 'email', icon: 'mail' })}
        ${ui.input({ label: 'Password', name: 'password', type: 'password', placeholder: '••••••••', required: true, autocomplete: 'current-password', icon: 'lock', labelAside: '<a class="field-link" href="#/forgot">Forgot password?</a>' })}
        ${ui.check({ label: 'Keep me signed in', checked: true })}
        <button type="submit" class="btn btn-primary btn-lg btn-block">Sign in</button>
      </form>
      <p class="auth-switch">New to RentCar? <a href="#/signup">Create an account</a></p>`);
  }

  function signup() {
    return authShell(`
      <h1 class="auth-title">Create your account</h1>
      <p class="auth-sub">Book cars across Albania in a few minutes.</p>
      ${roleSwitch()}
      <button type="button" class="btn btn-secondary btn-block btn-google" data-toast="Google sign-up is not connected in this prototype" data-toast-type="info">${RC.googleLogo}Sign up with Google</button>
      <div class="divider"><span>or with email</span></div>
      <form data-validate data-success="Account created — welcome to RentCar! (prototype)" novalidate>
        <div class="form-row">${ui.input({ label: 'First name', name: 'first', required: true, autocomplete: 'given-name', placeholder: 'Arben' })}${ui.input({ label: 'Last name', name: 'last', required: true, autocomplete: 'family-name', placeholder: 'Hoxha' })}</div>
        ${ui.input({ label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'name@example.com', autocomplete: 'email', icon: 'mail' })}
        ${ui.input({ label: 'Phone number', name: 'phone', type: 'tel', required: true, placeholder: '69 123 4567', prefix: '+355', inputmode: 'tel', hint: 'No SMS verification — the owner may call about your booking.' })}
        ${ui.input({ label: 'Password', name: 'password', type: 'password', required: true, minlength: 8, placeholder: 'At least 8 characters', autocomplete: 'new-password', strength: true })}
        ${ui.check({ label: 'I agree to the <a href="#">Terms of use</a> and <a href="#">Privacy policy</a>', required: true, name: 'terms' })}
        ${ui.check({ label: 'Send me offers and travel tips by email (optional)', name: 'promo' })}
        <button type="submit" class="btn btn-primary btn-lg btn-block">Create account</button>
      </form>
      <p class="auth-switch">Already have an account? <a href="#/signin">Sign in</a></p>`);
  }

  function forgot() {
    return authShell(`
      <form data-validate data-success-target="#d1-forgot-done" novalidate>
        <span class="auth-icon">${I('lock')}</span>
        <h1 class="auth-title">Reset your password</h1>
        <p class="auth-sub">Enter the email you signed up with and we’ll send you a link to choose a new password. The link is valid for 1 hour.</p>
        ${ui.input({ label: 'Email', name: 'email', type: 'email', required: true, placeholder: 'name@example.com', icon: 'mail' })}
        <button type="submit" class="btn btn-primary btn-lg btn-block">Send reset link</button>
        <p class="auth-switch"><a href="#/signin">${I('arrowLeft')}Back to sign in</a></p>
      </form>
      <div class="success-state" id="d1-forgot-done" hidden>
        <span class="success-icon">${I('mail')}</span>
        <h1 class="auth-title">Check your inbox</h1>
        <p class="auth-sub">If an account exists for that email, a reset link is on its way. Didn’t get it? Check your spam folder or try again in a minute.</p>
        <a class="btn btn-primary btn-block" href="#/signin">Back to sign in</a>
      </div>`);
  }

  // ---------------------------------------------------------------------------------------------
  // Dashboards
  // ---------------------------------------------------------------------------------------------
  var OWNER_NAV = [
    { group: 'Manage' },
    { key: 'overview', icon: 'dashboard', label: 'Overview' },
    { key: 'calendar', icon: 'calendar', label: 'Calendar' },
    { key: 'reservations', icon: 'calendarCheck', label: 'Reservations', badge: '9' },
    { key: 'fleet', icon: 'car', label: 'Vehicles' },
    { key: 'locations', icon: 'pin', label: 'Locations' },
    { group: 'Business' },
    { key: 'payments', icon: 'wallet', label: 'Payments & invoices', stub: true },
    { key: 'reviews', icon: 'star', label: 'Reviews', stub: true },
    { key: 'messages', icon: 'message', label: 'Messages' },
    { key: 'profile', icon: 'settings', label: 'Profile & settings', stub: true }
  ];
  var ADMIN_NAV = [
    { group: 'Platform' },
    { key: 'overview', icon: 'chart', label: 'Statistics' },
    { key: 'users', icon: 'users', label: 'Users' },
    { key: 'reservations', icon: 'calendarCheck', label: 'Reservations' },
    { key: 'invoices', icon: 'receipt', label: 'Invoices', badge: '7', stub: true },
    { group: 'Trust & safety' },
    { key: 'reviews', icon: 'star', label: 'Review moderation', stub: true },
    { key: 'reports', icon: 'flag', label: 'Reports & disputes' },
    { group: 'Administration' },
    { key: 'team', icon: 'team', label: 'Team', stub: true },
    { key: 'config', icon: 'sliders', label: 'Configuration', stub: true },
    { key: 'audit', icon: 'history', label: 'Audit log', stub: true }
  ];

  function dashShell(role, view, content) {
    var nav = role === 'owner' ? OWNER_NAV : ADMIN_NAV, me = role === 'owner' ? D.owner : D.admin;
    var unread = D.notifications.filter(function (n) { return n.unread; }).length;
    return `
    <div class="dash" id="d1-dash">
      <aside class="dash-side" aria-label="${role === 'owner' ? 'Provider' : 'Admin'} navigation">
        <div class="side-head">${logo()}<span class="side-tag">${role === 'owner' ? 'Provider' : 'Admin'}</span></div>
        <nav class="side-nav">
          ${nav.map(function (n) {
            if (n.group) return `<p class="side-group">${n.group}</p>`;
            var href = n.stub ? '#' : `#/${role}/${n.key}`;
            return `<a href="${href}" class="side-link${n.key === view ? ' is-active' : ''}"${n.stub ? ` data-toast="${n.label} isn’t part of this prototype" data-toast-type="info"` : ''}${n.key === view ? ' aria-current="page"' : ''}>${I(n.icon)}<span>${n.label}</span>${n.badge ? `<span class="side-badge">${n.badge}</span>` : ''}</a>`;
          }).join('')}
        </nav>
        <div class="side-foot">
          ${role === 'owner'
            ? `<div class="side-card"><b>Tirana Drive</b><span>Business · NIPT L91234567A</span><span class="side-card-row">${ui.badge('Card & cash', 'success')}</span></div>`
            : `<div class="side-card"><b>Commission rate</b><span>15% of every reservation total</span><span class="side-card-row">${ui.badge('Live', 'success')}</span></div>`}
          <a href="#/" class="side-link">${I('arrowLeft')}<span>Back to website</span></a>
        </div>
      </aside>
      <div class="dash-scrim" data-close="#d1-dash" data-toggle-class="side-open"></div>
      <div class="dash-main">
        <header class="dash-top">
          <button type="button" class="btn btn-ghost btn-icon dash-burger" data-toggle="#d1-dash" data-toggle-class="side-open" aria-label="Open navigation">${I('menu')}</button>
          <label class="dash-search">${I('search')}<input type="search" placeholder="${role === 'owner' ? 'Search reservations, customers, plates…' : 'Search users, reservations, NIPT…'}" aria-label="Search"><kbd>/</kbd></label>
          <div class="dash-actions">
            ${ui.themeToggle('btn btn-ghost btn-icon')}
            <button type="button" class="btn btn-ghost btn-icon hide-xs" data-tip="Help centre" data-toast="Help centre opens here" data-toast-type="info" aria-label="Help">${I('help')}</button>
            ${ui.dropdown({
              align: 'right', cls: 'notif-dd',
              trigger: `<button type="button" class="btn btn-ghost btn-icon notif-btn" data-dropdown-toggle aria-label="Notifications">${I('bell')}<span class="notif-count" data-unread-count>${unread}</span></button>`,
              items: [],
              menuHead: `<div class="notif-head"><b>Notifications</b><button type="button" class="link-btn" data-mark-read>Mark all as read</button></div>` +
                D.notifications.map(function (n) { return `<div class="notif${n.unread ? ' is-unread' : ''}"><span class="notif-icon">${I(n.icon)}</span><div><b>${n.title}</b><p>${n.text}</p><span>${n.time}</span></div></div>`; }).join(''),
              menuFoot: `<a class="notif-foot" href="#" data-toast="Notification centre not included" data-toast-type="info">View all notifications</a>`
            })}
            ${ui.dropdown({
              align: 'right',
              trigger: `<button type="button" class="user-btn" data-dropdown-toggle>${ui.avatar(me.name)}<span class="user-meta hide-sm"><b>${me.name}</b><small>${role === 'owner' ? 'Tirana Drive' : me.role}</small></span>${I('chevronDown', 'icon-xs hide-sm')}</button>`,
              items: [{ header: me.name }, { icon: 'user', label: 'Profile', toast: 'Profile isn’t part of this prototype', toastType: 'info' }, { icon: 'settings', label: 'Settings', toast: 'Settings aren’t part of this prototype', toastType: 'info' }, { icon: role === 'owner' ? 'shield' : 'key', label: role === 'owner' ? 'Switch to admin view' : 'Switch to provider view', href: role === 'owner' ? '#/admin/overview' : '#/owner/overview' }, { divider: true }, { icon: 'logout', label: 'Sign out', href: '#/signin' }]
            })}
          </div>
        </header>
        <main class="dash-content">${content}</main>
      </div>
    </div>`;
  }

  function pageHead(title, sub, actions) {
    return `<div class="page-head"><div><h1 class="page-title">${title}</h1>${sub ? `<p class="page-sub">${sub}</p>` : ''}</div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
  }

  function kpi(icon, label, value, foot, tone) {
    return `<div class="kpi"><div class="kpi-top"><span class="kpi-icon kpi-${tone || 'blue'}">${I(icon)}</span><span class="kpi-label">${label}</span></div><b class="kpi-value">${value}</b><p class="kpi-foot">${foot}</p></div>`;
  }
  function delta(n, suffix) { return `<span class="delta ${n >= 0 ? 'up' : 'down'}">${I(n >= 0 ? 'trendUp' : 'trendDown')}${n >= 0 ? '+' : ''}${n}${suffix || '%'}</span>`; }

  function scheduleList(items, kind) {
    return `<ul class="sched" role="list">${items.map(function (x) {
      return `<li class="sched-item${x.done ? ' is-done' : ''}"><span class="sched-time">${x.time}</span><div class="sched-body"><b>${x.vehicle}</b><span>${ui.plate(x.plate)} · ${x.customer}</span><small>${x.code} · ${x.location}${x.days ? ' · ' + x.days + ' days · ' + x.payment : ''}</small></div>${x.done ? ui.badge(kind === 'pickup' ? 'Checked in' : 'Returned', 'success') : `<button type="button" class="btn btn-secondary btn-sm" data-loading="${kind === 'pickup' ? 'Check-in confirmed for ' + x.code : 'Return noted for ' + x.code}">${kind === 'pickup' ? 'Check in' : 'Mark returned'}</button>`}</li>`;
    }).join('')}</ul>`;
  }

  function reservationsTable(rows, opts) {
    opts = opts || {};
    return ui.table({
      select: opts.select,
      rowAttrs: opts.tabs ? function (r) { var g = { Confirmed: 'upcoming', 'Pending payment': 'upcoming', 'In progress': 'progress', Completed: 'completed', Cancelled: 'cancelled', 'No-show': 'cancelled' }[r.status]; return ' data-item data-category="' + g + '"'; } : null,
      cols: [
        { label: 'Reservation', render: function (r) { return `<a class="mono link-strong" href="#" data-toast="Reservation ${r.code} details (prototype)" data-toast-type="info">${r.code}</a>`; } },
        { label: 'Customer', render: function (r) { return `<span class="cell-user">${ui.avatar(r.customer, 'sm')}<span><b>${r.customer}</b>${opts.compact ? '' : `<small>${r.email}</small>`}</span></span>`; } },
        { label: 'Vehicle', render: function (r) { return `<span class="cell-stack"><b>${r.vehicle}</b><small>${r.plate}</small></span>`; } },
        { label: 'Pick-up', render: function (r) { return r.pickup; } },
        { label: 'Return', render: function (r) { return r.ret; } },
        { label: 'Total', cls: 'num', render: function (r) { return `<span class="cell-stack"><b>${F.all(r.total)}</b><small>${r.payment}</small></span>`; } },
        { label: 'Status', render: function (r) { return ui.status(r.status); } },
        { label: '', cls: 'col-actions', render: function (r) { return ui.rowActions(r.code, r.status === 'Confirmed' ? [{ icon: 'key', label: 'Check in', toast: 'Check-in confirmed for ' + r.code }] : []); } }
      ].filter(function (c) { return !(opts.compact && (c.label === 'Return')); }),
      rows: rows
    });
  }

  function ownerOverview() {
    var k = D.owner.kpis, model = ui.calendarModel(2026, 10);
    return `
    ${pageHead('Good morning, ' + D.owner.first, D.schedule.label + ' · here’s what’s happening at Tirana Drive', `
      ${ui.select({ name: 'period', options: ['November 2026', 'October 2026', 'September 2026'], value: 'November 2026', cls: 'field-inline' })}
      ${ui.select({ name: 'loc', options: ['All locations', 'Tirana Center Office', 'Blloku Parking', 'Tirana Airport (TIA)'], cls: 'field-inline hide-sm' })}`)}
    <div class="kpi-grid">
      ${kpi('car', 'Total vehicles', k.vehicles, `${k.activeVehicles} active · 1 inactive`)}
      ${kpi('calendarCheck', 'Upcoming reservations', k.upcoming, `${delta(k.upcomingDelta, '')} ${k.next7} in the next 7 days`, 'violet')}
      ${kpi('wallet', 'Revenue this month', F.all(k.revenue), `${delta(k.revenueDelta)} vs October`, 'green')}
      ${kpi('activity', 'Average occupancy', k.occupancy + '%', 'Reserved days ÷ days in month', 'amber')}
    </div>
    <div class="dash-grid">
      <section class="panel span-5">
        <div class="panel-head"><h2 class="panel-title">Today</h2><span class="muted">${D.schedule.pickups.length} pick-ups · ${D.schedule.returns.length} returns</span></div>
        <div class="tabs" data-tabs>
          <div class="tab-list tab-underline" role="tablist"><button class="tab is-active" role="tab" data-tab="p">Pick-ups <span class="tab-count">${D.schedule.pickups.length}</span></button><button class="tab" role="tab" data-tab="r">Returns <span class="tab-count">${D.schedule.returns.length}</span></button></div>
          <div class="tab-panel" data-panel="p">${scheduleList(D.schedule.pickups, 'pickup')}</div>
          <div class="tab-panel" data-panel="r" hidden>${scheduleList(D.schedule.returns, 'return')}</div>
        </div>
      </section>
      <section class="panel span-7">
        <div class="panel-head"><div><h2 class="panel-title">Monthly revenue</h2><p class="muted">Card (net of commission & POK fee) plus cash, in ALL</p></div><a class="link-arrow" href="#" data-toast="Payments & invoices isn’t part of this prototype" data-toast-type="info">Payments ${I('arrowRight')}</a></div>
        ${ui.barsV(D.owner.revenueMonths, { highlightLast: true, fmt: F.all, tickFmt: function (n) { return Math.round(n / 1000) + 'k'; }, label: 'Monthly revenue, June to November 2026' })}
        <div class="split-stats">
          <div><span>${I('card')}Card · net</span><b>${F.all(k.revenueCard)}</b></div>
          <div><span>${I('cash')}Cash · collected</span><b>${F.all(k.revenueCash)}</b></div>
          <div><span>${I('receipt')}Commission due (cash)</span><b>${F.all(k.commissionDue)}</b></div>
        </div>
      </section>
      <section class="panel span-8 panel-flush">
        <div class="panel-head"><h2 class="panel-title">Recent reservations</h2><a class="link-arrow" href="#/owner/reservations">View all ${I('arrowRight')}</a></div>
        ${reservationsTable(D.reservations.slice(0, 6), { compact: true })}
      </section>
      <section class="panel span-4">
        <div class="panel-head"><div><h2 class="panel-title">Occupancy · November</h2><p class="muted">Share of days reserved per car</p></div></div>
        ${ui.barsH(model.occupancy.slice().sort(function (a, b) { return b.pct - a.pct; }).map(function (o) { return { label: `${o.vehicle.short} <small>${o.vehicle.plate}</small>`, value: Math.round(o.pct) + '%', pct: o.pct, tip: o.vehicle.name + ' · ' + o.days + ' of 30 days reserved' }; }))}
      </section>
    </div>`;
  }

  function fleetView() {
    var cats = ['All categories', 'Economy', 'Compact', 'SUV', 'Luxury', 'Van'];
    return `
    ${pageHead('Vehicles', '12 vehicles · 11 active and visible in search', `<button type="button" class="btn btn-secondary hide-sm" data-toast="Export started — fleet.xlsx (prototype)">${I('download')}Export</button><button type="button" class="btn btn-primary" data-modal-open="d1-add-vehicle">${I('plus')}Add vehicle</button>`)}
    <section class="panel panel-flush">
      <div class="table-toolbar">
        <div class="tabs" data-tabs data-tab-filter="#d1-fleet-table"><div class="tab-list tab-pills" role="tablist"><button class="tab is-active" data-tab="all">All <span class="tab-count">12</span></button><button class="tab" data-tab="Active">Active <span class="tab-count">11</span></button><button class="tab" data-tab="Inactive">Inactive <span class="tab-count">1</span></button></div></div>
        <div class="toolbar-filters"><label class="input-search">${I('search')}<input type="search" placeholder="Search model or plate" aria-label="Search vehicles"></label>${ui.select({ name: 'cat', options: cats, cls: 'field-inline' })}</div>
      </div>
      <div id="d1-fleet-table">
      ${ui.table({
        rowAttrs: function (r) { return ' data-item data-category="' + r.status + '"'; },
        cols: [
          { label: 'Vehicle', render: function (r) { return `<span class="cell-vehicle">${ui.img(r.image, r.name)}<span><b>${r.name}</b><small>${r.trim} · ${r.year}</small></span></span>`; } },
          { label: 'Plate', render: function (r) { return ui.plate(r.plate); } },
          { label: 'Category', render: function (r) { return r.category; } },
          { label: 'Location', render: function (r) { return r.location; } },
          { label: 'Daily price', cls: 'num', render: function (r) { return `<b>${F.all(r.price)}</b>`; } },
          { label: 'Status', render: function (r) { return ui.status(r.status); } },
          { label: 'Today', render: function (r) { return `<span class="today today-${r.todayType}">${r.today}</span>`; } },
          { label: '', cls: 'col-actions', render: function (r) { return `<div class="row-btns"><a class="btn btn-secondary btn-sm" href="#/vehicle/${r.id.replace('-2', '')}">${I('eye')}View</a><button type="button" class="btn btn-ghost btn-sm" data-modal-open="d1-add-vehicle">${I('edit')}Edit</button></div>`; } }
        ],
        rows: D.fleet
      })}
      </div>
      ${ui.pagination({ info: 'Showing 1–12 of 12 vehicles', pages: 1 })}
    </section>
    ${addVehicleModal()}`;
  }

  function addVehicleModal() {
    return ui.modal({
      id: 'd1-add-vehicle', size: 'lg', title: 'Add a vehicle', subtitle: 'Cars appear in search once they have a photo, an active location and an active account.',
      body: `<form data-validate data-success="Vehicle saved (prototype — nothing was stored)" id="d1-vehicle-form" novalidate>
        <div class="form-grid">
          ${ui.select({ label: 'Make & model', name: 'model', options: [['', 'Select from the list'], 'Volkswagen Golf', 'Toyota Yaris', 'Kia Sportage', 'Mercedes-Benz C-Class', 'BMW 3 Series'], required: true })}
          ${ui.input({ label: 'Registration plate', name: 'plate', placeholder: 'AA 123 BB', required: true, hint: 'Must be unique on the platform' })}
          ${ui.select({ label: 'Category', name: 'category', options: ['Economy', 'Compact', 'SUV', 'Luxury', 'Van'] })}
          ${ui.select({ label: 'Transmission', name: 'gear', options: ['Manual', 'Automatic'] })}
          ${ui.select({ label: 'Fuel', name: 'fuel', options: ['Petrol', 'Diesel', 'Hybrid', 'Electric'] })}
          ${ui.input({ label: 'Seats', name: 'seats', type: 'number', value: '5' })}
          ${ui.input({ label: 'Price per day', name: 'price', type: 'number', placeholder: '4500', required: true, prefix: 'ALL' })}
          ${ui.select({ label: 'Pick-up location', name: 'location', options: ['Tirana Center Office', 'Blloku Parking', 'Tirana Airport (TIA)'] })}
        </div>
        <div class="dropzone" data-toast="The file picker opens here — up to 4 photos" data-toast-type="info" role="button" tabindex="0">${I('upload')}<b>Upload photos</b><span>1–4 photos, JPG or PNG. Choose the main photo after uploading.</span></div>
        <div class="modal-actions"><button type="button" class="btn btn-tertiary" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">Save vehicle</button></div>
      </form>`
    });
  }

  function reservationsView() {
    var all = D.reservations;
    var c = function (g) { return all.filter(function (r) { return ({ Confirmed: 'upcoming', 'Pending payment': 'upcoming', 'In progress': 'progress', Completed: 'completed', Cancelled: 'cancelled', 'No-show': 'cancelled' })[r.status] === g; }).length; };
    return `
    ${pageHead('Reservations', 'Confirmed instantly · check in customers and record no-shows from here', `<button type="button" class="btn btn-secondary" data-toast="Export started — reservations.xlsx (prototype)">${I('download')}Export to Excel</button>`)}
    <section class="panel panel-flush">
      <div class="table-toolbar">
        <div class="tabs" data-tabs data-tab-filter="#d1-res-table"><div class="tab-list tab-underline" role="tablist">
          <button class="tab is-active" data-tab="all">All <span class="tab-count">${all.length}</span></button><button class="tab" data-tab="upcoming">Upcoming <span class="tab-count">${c('upcoming')}</span></button><button class="tab" data-tab="progress">In progress <span class="tab-count">${c('progress')}</span></button><button class="tab" data-tab="completed">Completed <span class="tab-count">${c('completed')}</span></button><button class="tab" data-tab="cancelled">Cancelled & no-show <span class="tab-count">${c('cancelled')}</span></button>
        </div></div>
      </div>
      <div class="table-toolbar table-toolbar-sub">
        <label class="input-search">${I('search')}<input type="search" placeholder="Code or customer name" aria-label="Search reservations"></label>
        <div class="toolbar-filters">
          ${ui.select({ name: 'loc', options: ['All locations', 'Tirana Center Office', 'Blloku Parking', 'Tirana Airport (TIA)'], cls: 'field-inline' })}
          ${ui.select({ name: 'pay', options: ['Card & cash', 'Card only', 'Cash only'], cls: 'field-inline' })}
          <span class="date-filter">${ui.dateInput({ name: 'from', value: '2026-11-01' })}</span>
        </div>
      </div>
      <div id="d1-res-table">${reservationsTable(all, { select: true, tabs: true })}</div>
      ${ui.pagination({ info: 'Showing 1–13 of 86 reservations', pages: 7 })}
    </section>`;
  }

  function calendarPartial(model) {
    var days = model.days, n = model.daysIn, sel = RC.state.cal.day;
    var head = days.map(function (d) { return `<span class="gd${d.weekend ? ' is-weekend' : ''}${d.today ? ' is-today' : ''}"><small>${F.DAYS[d.date.getDay()].slice(0, 2)}</small>${d.d}</span>`; }).join('');
    var bg = days.map(function (d) { return `<span class="gcell${d.weekend ? ' is-weekend' : ''}${d.today ? ' is-today' : ''}"></span>`; }).join('');
    var reserved = 0, blocked = 0;
    model.events.forEach(function (e) { var len = e.end - e.start + 1; if (e.type === 'reserved') reserved += len; else if (e.type !== 'buffer') blocked += len; });
    var total = model.vehicles.length * n;
    var agenda = model.eventsOn(Math.min(sel, n));
    return `
    <div class="cal-stats">
      <div><span>Occupancy</span><b>${Math.round(reserved / total * 100)}%</b></div>
      <div><span>Reserved days</span><b>${reserved}</b></div>
      <div><span>Blocked days</span><b>${blocked}</b></div>
      <div><span>Available days</span><b>${total - reserved - blocked}</b></div>
    </div>
    <section class="panel panel-flush">
      <div class="cal-toolbar">
        <div class="cal-nav">
          <button type="button" class="btn btn-secondary btn-icon btn-sm" data-cal-nav="prev" aria-label="Previous month">${I('chevronLeft')}</button>
          <h2 class="cal-title">${model.label}</h2>
          <button type="button" class="btn btn-secondary btn-icon btn-sm" data-cal-nav="next" aria-label="Next month">${I('chevronRight')}</button>
          <button type="button" class="btn btn-ghost btn-sm" data-cal-nav="today">Today</button>
        </div>
        <div class="cal-tools">
          <div class="segmented" data-segmented role="group" aria-label="Calendar range"><button type="button" data-toast="Day view not included in this prototype" data-toast-type="info">Day</button><button type="button" data-toast="Week view not included in this prototype" data-toast-type="info">Week</button><button type="button" class="is-active">Month</button></div>
          ${ui.select({ name: 'calloc', options: ['All locations', 'Tirana Center Office', 'Blloku Parking', 'Tirana Airport (TIA)'], cls: 'field-inline hide-sm' })}
          <button type="button" class="btn btn-primary btn-sm" data-modal-open="d1-block">${I('plus')}Block dates</button>
        </div>
      </div>
      <div class="gantt-wrap">
        <div class="gantt" style="--days:${n}">
          <div class="gantt-row gantt-head"><div class="gantt-veh">Vehicle</div><div class="gantt-track">${head}</div></div>
          ${model.vehicles.map(function (veh) {
            return `<div class="gantt-row"><div class="gantt-veh"><b>${veh.short}</b><small>${veh.plate}</small></div><div class="gantt-track">${bg}${model.eventsFor(veh.id).map(function (e) {
              return `<button type="button" class="gantt-ev cal-${e.type}" style="grid-column:${e.start} / ${e.end + 1}" data-cal-event="${esc(e.label)}" data-tip="${esc(e.label)} · ${e.start}–${e.end} ${F.MONTHS[model.m].slice(0, 3)}"><span>${esc(e.type === 'reserved' ? e.label.split(' · ')[0] : e.label)}</span></button>`;
            }).join('')}</div></div>`;
          }).join('')}
        </div>
      </div>
      <div class="cal-foot">${ui.calLegend()}<p class="muted">Click a booking for details · click “Block dates” for service or personal use</p></div>
    </section>
    <section class="panel cal-agenda">
      <div class="panel-head"><h2 class="panel-title">Agenda · ${Math.min(sel, n)} ${F.MONTHS[model.m]}</h2></div>
      <ul class="agenda" role="list">${agenda.length ? agenda.map(function (e) { var v = model.vehicle(e.v); return `<li><span class="cal-swatch cal-${e.type}"></span><div><b>${esc(e.label)}</b><small>${v.short} · ${v.plate} · ${e.start}–${e.end} ${F.MONTHS[model.m].slice(0, 3)}</small></div></li>`; }).join('') : '<li class="muted">No bookings or blocks on this day.</li>'}</ul>
    </section>`;
  }

  function calendarView() {
    return `
    ${pageHead('Availability calendar', 'Reservations appear automatically · block dates for service, personal use or off-platform bookings')}
    <div data-cal-root>${calendarPartial(ui.calendarModel(RC.state.cal.y, RC.state.cal.m))}</div>
    ${ui.modal({ id: 'd1-block', title: 'Block dates', subtitle: 'Blocked cars don’t appear in search for the selected period.', body: `<form data-validate data-success="Dates blocked (prototype)" novalidate><div class="form-grid">
      ${ui.select({ label: 'Vehicle', name: 'veh', options: D.calendarVehicles.map(function (v) { return v.short + ' · ' + v.plate; }) })}
      ${ui.select({ label: 'Reason', name: 'reason', options: ['Service', 'Personal use', 'Off-platform booking (phone, walk-in)'] })}
      <div class="field"><span class="field-label">From</span><div class="search-dt">${ui.dateInput({ name: 'bfrom', value: '2026-11-17', range: 'start' })}${ui.timeSelect({ name: 'bft', value: '08:00' })}</div></div>
      <div class="field"><span class="field-label">Until</span><div class="search-dt">${ui.dateInput({ name: 'bto', value: '2026-11-19', range: 'end' })}${ui.timeSelect({ name: 'btt', value: '18:00' })}</div></div>
      ${ui.input({ label: 'Note', name: 'note', type: 'textarea', rows: 2, optional: true, placeholder: 'Annual inspection at Auto Servis Kombinat', cls: 'span-2' })}
      </div><div class="modal-actions"><button type="button" class="btn btn-tertiary" data-modal-close>Cancel</button><button type="submit" class="btn btn-primary">Block dates</button></div></form>` })}`;
  }

  function locationsView() {
    return `
    ${pageHead('Pick-up locations', 'Cars are only shown in search when their location is active', `<button type="button" class="btn btn-primary" data-toast="New location form opens here (prototype)" data-toast-type="info">${I('plus')}Add location</button>`)}
    <div class="loc-grid">
      ${D.ownerLocations.map(function (id) {
        var l = D.locations[id], inactive = l.status !== 'Active';
        return `<article class="loc-card${inactive ? ' is-inactive' : ''}">
          <div class="loc-map">${ui.map({ single: { x: 50, y: 52 }, controls: false, cls: 'map-mini' })}<span class="loc-type">${I(l.type === 'Airport' ? 'plane' : l.type === 'Parking' ? 'parking' : 'building')}${l.type}</span></div>
          <div class="loc-body">
            <div class="loc-title"><h3>${l.name}</h3>${ui.status(l.status)}</div>
            <p class="loc-addr">${I('pin')}${l.address}</p>
            <p class="loc-addr">${I('clock')}${l.hoursShort}</p>
            <div class="loc-stats"><div><b>${l.vehicles}</b><span>vehicles</span></div><div><b>${l.today.pickups}</b><span>pick-ups today</span></div><div><b>${l.today.returns}</b><span>returns today</span></div></div>
          </div>
          <div class="loc-foot"><button type="button" class="btn btn-secondary btn-sm" data-toast="Edit location (prototype)" data-toast-type="info">${I('edit')}Edit</button>${inactive ? `<button type="button" class="btn btn-ghost btn-sm" data-loading="${l.name} reactivated (prototype)">Reactivate</button>` : `<button type="button" class="btn btn-ghost btn-sm" data-toast="A location can only be deactivated when it has no upcoming reservations" data-toast-type="warning">Deactivate</button>`}</div>
        </article>`;
      }).join('')}
    </div>`;
  }

  function messagesView() {
    return `${pageHead('Messages', 'Chat with customers about their reservations')}
    <section class="panel panel-empty">${ui.empty({ icon: 'message', title: 'No conversations yet', text: 'A chat opens automatically when a customer books one of your cars. You’ll be notified of new messages by email and push.', action: '<a class="btn btn-secondary btn-sm" href="#/owner/reservations">Go to reservations</a>' })}</section>`;
  }

  function owner(route) {
    var v = route.params.view;
    var map = { overview: ownerOverview, fleet: fleetView, reservations: reservationsView, calendar: calendarView, locations: locationsView, messages: messagesView };
    return dashShell('owner', v, (map[v] || ownerOverview)());
  }

  // ---- admin ----------------------------------------------------------------------------------
  function adminOverview() {
    var k = D.admin.kpis;
    var maxStatus = D.admin.byStatus[0][1];
    return `
    ${pageHead('Platform statistics', 'November 2026 · all providers and locations', `${ui.select({ name: 'period', options: ['This month', 'Last 30 days', 'This year'], cls: 'field-inline' })}<button type="button" class="btn btn-secondary hide-sm" data-toast="Report exported (prototype)">${I('download')}Export</button>`)}
    <div class="kpi-grid">
      ${kpi('users', 'Total users', F.num(k.users), `${delta(k.usersDelta, '')} new this month`)}
      ${kpi('building', 'Rental providers', F.num(k.providers), `${delta(k.providersDelta, '')} new this month`, 'violet')}
      ${kpi('car', 'Total vehicles', F.num(k.vehicles), `${F.num(k.activeVehicles)} active in search`, 'green')}
      ${kpi('calendarCheck', 'Total reservations', F.num(k.reservations), `${delta(k.reservationsDelta)} ${F.num(k.reservationsMonth)} this month`, 'amber')}
    </div>
    <div class="dash-grid">
      <section class="panel span-8">
        <div class="panel-head"><div><h2 class="panel-title">Reservations per day</h2><p class="muted">1–14 November · all statuses</p></div></div>
        ${ui.barsV(D.admin.daily.map(function (d) { return [String(d[0]), d[1]]; }), { highlightLast: true, ticks: 3, label: 'Reservations per day, 1 to 14 November', fmt: function (n) { return n + ' reservations'; } })}
      </section>
      <section class="panel span-4">
        <div class="panel-head"><div><h2 class="panel-title">By status</h2><p class="muted">${F.num(k.reservationsMonth)} reservations this month</p></div></div>
        ${ui.barsH(D.admin.byStatus.map(function (s) { return { label: s[0], value: s[1], pct: s[1] / maxStatus * 100, tip: s[0] + ' · ' + s[1] + ' reservations' }; }))}
      </section>
      <section class="panel span-12 mini-stats">
        <div><span>${I('card')}Commission · card</span><b>${F.all(k.commissionCard)}</b></div>
        <div><span>${I('cash')}Commission · cash (invoiced)</span><b>${F.all(k.commissionCash)}</b></div>
        <div><span>${I('receipt')}Unpaid invoices</span><b>${k.unpaidInvoices} · ${F.all(k.unpaidAmount)}</b></div>
        <div><span>${I('ban')}Cancellations by providers</span><b>${k.providerCancellations}</b></div>
      </section>
      <section class="panel span-8 panel-flush">
        <div class="panel-head"><h2 class="panel-title">Recent reservations</h2><a class="link-arrow" href="#/admin/reservations">Manage ${I('arrowRight')}</a></div>
        ${adminResTable(D.adminReservations.slice(0, 6), true)}
      </section>
      <section class="panel span-4">
        <div class="panel-head"><h2 class="panel-title">New registrations</h2><a class="link-arrow" href="#/admin/users">All users ${I('arrowRight')}</a></div>
        <ul class="reg-list" role="list">${D.registrations.map(function (r) { return `<li>${ui.avatar(r.name)}<div><b>${r.name}</b><small>${r.role} · ${r.city}</small></div><span class="muted">${r.date}</span></li>`; }).join('')}</ul>
      </section>
    </div>`;
  }

  function adminResTable(rows, compact) {
    return ui.table({
      select: !compact,
      cols: [
        { label: 'Code', render: function (r) { return `<span class="mono link-strong">${r.code}</span>`; } },
        { label: 'Customer', render: function (r) { return `<span class="cell-user">${ui.avatar(r.customer, 'sm')}<b>${r.customer}</b></span>`; } },
        { label: 'Provider', render: function (r) { return r.provider; } },
        { label: 'Vehicle', render: function (r) { return r.vehicle; } },
        { label: 'Dates', render: function (r) { return r.pickup + ' – ' + r.ret; } },
        { label: 'Total', cls: 'num', render: function (r) { return `<span class="cell-stack"><b>${F.all(r.total)}</b><small>${r.payment}</small></span>`; } },
        { label: 'Status', render: function (r) { return ui.status(r.status); } },
        { label: '', cls: 'col-actions', render: function (r) { return ui.rowActions(r.code); } }
      ].filter(function (c) { return !(compact && c.label === 'Vehicle'); }),
      rows: rows
    });
  }

  function adminUsers() {
    var u = D.users, cnt = function (f) { return u.filter(f).length; };
    var grp = function (r) { return r.status === 'Suspended' ? 'suspended' : r.role.indexOf('Provider') === 0 ? 'provider' : 'customer'; };
    return `
    ${pageHead('Users', 'Customers and rental providers · suspensions require a reason and are logged', `<button type="button" class="btn btn-secondary" data-toast="Export started — users.xlsx (prototype)">${I('download')}Export</button>`)}
    <section class="panel panel-flush">
      <div class="table-toolbar">
        <div class="tabs" data-tabs data-tab-filter="#d1-users"><div class="tab-list tab-underline" role="tablist">
          <button class="tab is-active" data-tab="all">All users <span class="tab-count">${u.length}</span></button><button class="tab" data-tab="customer">Customers <span class="tab-count">${cnt(function (r) { return grp(r) === 'customer'; })}</span></button><button class="tab" data-tab="provider">Providers <span class="tab-count">${cnt(function (r) { return grp(r) === 'provider'; })}</span></button><button class="tab" data-tab="suspended">Suspended <span class="tab-count">${cnt(function (r) { return grp(r) === 'suspended'; })}</span></button>
        </div></div>
        <label class="input-search">${I('search')}<input type="search" placeholder="Name, email, phone or NIPT" aria-label="Search users"></label>
      </div>
      <div id="d1-users">${ui.table({
        select: true,
        rowAttrs: function (r) { return ' data-item data-category="' + grp(r) + '"'; },
        cols: [
          { label: 'User', render: function (r) { return `<span class="cell-user">${ui.avatar(r.name, 'sm')}<span><b>${r.name}</b><small>${r.email}</small></span></span>`; } },
          { label: 'Role', render: function (r) { return r.role; } },
          { label: 'Phone', render: function (r) { return `<span class="nowrap">${r.phone}</span>`; } },
          { label: 'Joined', render: function (r) { return r.joined; } },
          { label: 'Reservations', cls: 'num', render: function (r) { return F.num(r.reservations); } },
          { label: 'Status', render: function (r) { return ui.status(r.status); } },
          { label: '', cls: 'col-actions', render: function (r) {
            return ui.dropdown({ align: 'right', trigger: `<button type="button" class="btn btn-ghost btn-icon btn-sm" data-dropdown-toggle aria-label="Actions for ${esc(r.name)}">${I('more')}</button>`, items: [
              { icon: 'user', label: 'View profile', toast: 'Profile of ' + r.name + ' (prototype)', toastType: 'info' },
              { icon: r.status === 'Suspended' ? 'refresh' : 'ban', label: r.status === 'Suspended' ? 'Lift suspension' : 'Suspend account', toast: 'A reason is required — this would be written to the audit log (prototype)', toastType: 'warning' },
              { divider: true }, { icon: 'trash', label: 'Delete account', danger: true, toast: 'Only administrators can delete accounts (prototype — nothing deleted)', toastType: 'warning' }] });
          } }
        ],
        rows: u
      })}</div>
      ${ui.pagination({ info: 'Showing 1–10 of 4,286 users', pages: 429 })}
    </section>`;
  }

  function adminReservations() {
    return `
    ${pageHead('Reservations', 'Every reservation on the platform · cancellations by an admin refund the customer in full')}
    <section class="panel panel-flush">
      <div class="table-toolbar">
        <label class="input-search">${I('search')}<input type="search" placeholder="Search by code, e.g. RC-1048" aria-label="Search by code"></label>
        <div class="toolbar-filters">
          ${ui.select({ name: 'st', options: ['All statuses', 'Pending payment', 'Confirmed', 'In progress', 'Completed', 'Cancelled', 'No-show'], cls: 'field-inline' })}
          ${ui.select({ name: 'pay', options: ['Card & cash', 'Card', 'Cash'], cls: 'field-inline' })}
          ${ui.select({ name: 'prov', options: ['All providers', 'Tirana Drive', 'Rinas Airport Rentals', 'Adriatik Auto', 'Albania Premium Cars'], cls: 'field-inline hide-sm' })}
        </div>
      </div>
      ${adminResTable(D.adminReservations, false)}
      ${ui.pagination({ info: 'Showing 1–10 of 12,904 reservations', pages: 1291 })}
    </section>`;
  }

  function adminReports() {
    return `${pageHead('Reports & disputes', 'Reported accounts, cars and locations, and no-shows disputed by customers')}
    <section class="panel">
      <div class="tabs" data-tabs>
        <div class="tab-list tab-underline" role="tablist"><button class="tab is-active" data-tab="a">Reports <span class="tab-count">0</span></button><button class="tab" data-tab="b">Disputed no-shows <span class="tab-count">0</span></button></div>
        <div class="tab-panel" data-panel="a">${ui.empty({ icon: 'flag', title: 'No open reports', text: 'When a user reports a suspicious account, car or location it lands here for review.', action: '<a class="btn btn-secondary btn-sm" href="#/admin/overview">Back to statistics</a>' })}</div>
        <div class="tab-panel" data-panel="b" hidden>${ui.empty({ icon: 'checkCircle', title: 'No disputed no-shows', text: 'If a customer says they did pick up the car after a no-show report, the case appears here for a manager.' })}</div>
      </div>
    </section>`;
  }

  function admin(route) {
    var v = route.params.view;
    var map = { overview: adminOverview, users: adminUsers, reservations: adminReservations, reports: adminReports };
    return dashShell('admin', v, (map[v] || adminOverview)());
  }

  // ---------------------------------------------------------------------------------------------
  // Style guide
  // ---------------------------------------------------------------------------------------------
  function styleguide() {
    var spec = {
      header: `<header class="sg-hero"><span class="eyebrow">RentCar · Design system</span><h1 class="display-sm">Modern Minimal</h1><p class="lead">A calm, trustworthy marketplace. One confident blue for action, neutral greys for everything else, soft 1px borders and low, diffuse shadows. Rounded but not bubbly: 10px controls, 14px cards.</p>
        <div class="sg-principles"><div><b>Clarity first</b><span>Every screen answers “what does it cost and what happens next?”</span></div><div><b>Quiet surfaces</b><span>White cards on a light grey canvas; colour is reserved for actions and status.</span></div><div><b>Generous rhythm</b><span>8px spacing grid, 96px between home sections.</span></div></div></header>`,
      colorNote: 'Blue is the only brand colour. Status colours are reserved for meaning and always paired with a label.',
      colors: [
        { group: 'Brand', items: [{ name: 'Blue 600 · primary', hex: '#2563EB', use: 'Buttons, links, focus' }, { name: 'Blue 700 · hover', hex: '#1D4ED8' }, { name: 'Blue 50 · tint', hex: '#EFF4FF', use: 'Selected, info' }, { name: 'Ink 900', hex: '#0F172A', use: 'Headings, dark buttons' }] },
        { group: 'Neutrals', items: [{ name: 'Canvas', hex: '#F6F7F9' }, { name: 'Surface', hex: '#FFFFFF' }, { name: 'Border', hex: '#E4E7EC' }, { name: 'Text secondary', hex: '#475467' }, { name: 'Text muted', hex: '#667085' }] },
        { group: 'Status', items: [{ name: 'Success', hex: '#067647' }, { name: 'Warning', hex: '#B54708' }, { name: 'Danger', hex: '#B42318' }, { name: 'Violet · in progress', hex: '#5925DC' }] }
      ],
      fonts: [{ family: 'Plus Jakarta Sans', role: 'Single family for display, UI and body · 400–800', css: '"Plus Jakarta Sans"', sample: 'Aa' }],
      typeNote: 'One geometric sans with tight tracking on large sizes. Tabular figures for prices.',
      type: [
        { name: 'Display', meta: '56/60 · 800 · −3%', cls: 'display', sample: 'Rent the right car' },
        { name: 'Heading 1', meta: '36/44 · 700', cls: 'h1', sample: 'Mercedes-Benz C-Class' },
        { name: 'Heading 2', meta: '28/36 · 700', cls: 'h2', sample: 'Featured cars this week' },
        { name: 'Heading 3', meta: '20/28 · 700', cls: 'h3', sample: 'Rental rules' },
        { name: 'Body', meta: '16/26 · 400', cls: 'body-text', sample: 'Totals include every day of your rental and any long-rental discount.' },
        { name: 'Small', meta: '14/20 · 500', cls: 'small-text', sample: 'Free cancellation until 15 Nov, 10:00' },
        { name: 'Caption', meta: '12/16 · 600 · caps', cls: 'caption-text', sample: 'Pick-up location' }
      ],
      tokenNote: '4px base unit; components snap to 8px.',
      spacing: [4, 8, 12, 16, 24, 32, 48, 64, 96],
      radii: [['Small', '6px'], ['Control', '10px'], ['Card', '14px'], ['Panel', '20px'], ['Pill', '999px']],
      shadows: [['xs', '0 1px 2px rgba(16,24,40,.06)'], ['sm', '0 1px 3px rgba(16,24,40,.08), 0 1px 2px rgba(16,24,40,.04)'], ['md', '0 8px 20px -6px rgba(16,24,40,.12)'], ['lg', '0 24px 48px -12px rgba(16,24,40,.18)']],
      cards: `<div class="sg-cards">${vcard(RC.vehicle('kia-sportage'))}${resultCard(RC.vehicle('mercedes-c'))}</div>`
    };
    return `${header('styleguide')}<main class="container sg-page">${ui.styleguide(spec)}</main>${footer()}`;
  }

  RC.registerDesign('d1', {
    name: 'Modern Minimal',
    titles: { home: 'Home', search: 'Cars in Tirana', vehicle: 'Vehicle', signin: 'Sign in', signup: 'Create account', forgot: 'Reset password', owner: 'Provider dashboard', admin: 'Admin', styleguide: 'Style guide' },
    views: { home: home, search: search, vehicle: vehicle, signin: signin, signup: signup, forgot: forgot, owner: owner, admin: admin, styleguide: styleguide },
    partials: { calendar: calendarPartial }
  });
})();
