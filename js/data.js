/* Static mock data for the prototype. Domain rules follow RentalCars_Functional_Specification_v1.0:
   prices are stored in ALL (EUR is display-only, "≈"), reservation codes are RC-####, payments are
   card (via POK) or cash at pickup, statuses and cancellation policies follow chapters 6–8. */
window.RC = window.RC || {};

(function () {
  var IMG = 'assets/images/';

  var providers = {
    'tirana-drive': { id: 'tirana-drive', name: 'Tirana Drive', type: 'Business', since: 2019, rating: 4.8, reviews: 212, cars: 12, payments: ['card', 'cash'], policy: 'Moderate', responds: 'Usually replies within 1 hour', initials: 'TD' },
    'rinas-rentals': { id: 'rinas-rentals', name: 'Rinas Airport Rentals', type: 'Business', since: 2017, rating: 4.7, reviews: 348, cars: 26, payments: ['card', 'cash'], policy: 'Flexible', responds: 'Usually replies within 2 hours', initials: 'RA' },
    'ilir-d': { id: 'ilir-d', name: 'Ilir D.', type: 'Individual', since: 2023, rating: 4.6, reviews: 17, cars: 2, payments: ['cash'], policy: 'Flexible', responds: 'Usually replies within 3 hours', initials: 'ID' },
    'albania-premium': { id: 'albania-premium', name: 'Albania Premium Cars', type: 'Business', since: 2020, rating: 4.9, reviews: 96, cars: 9, payments: ['card', 'cash'], policy: 'Strict', responds: 'Usually replies within 30 minutes', initials: 'AP' },
    'adriatik-auto': { id: 'adriatik-auto', name: 'Adriatik Auto', type: 'Business', since: 2016, rating: 4.6, reviews: 154, cars: 31, payments: ['card', 'cash'], policy: 'Moderate', responds: 'Usually replies within 2 hours', initials: 'AA' }
  };

  var locations = {
    'tirana-center': { id: 'tirana-center', name: 'Tirana Center Office', short: 'Center Office', type: 'Office', city: 'Tirana', address: 'Rr. Myslym Shyri 42, Tirana 1001', distance: '1.2 km', hours: [['Mon – Sat', '08:00 – 20:00'], ['Sunday', '09:00 – 14:00']], hoursShort: 'Mon–Sat 08:00–20:00 · Sun 09:00–14:00', status: 'Active', vehicles: 5, today: { pickups: 2, returns: 1 }, instructions: 'Ground-floor office next to Farmacia Myslym Shyri. Customer parking in the inner courtyard, entrance B.', map: { x: 48, y: 47 } },
    'blloku': { id: 'blloku', name: 'Blloku Parking', short: 'Blloku Parking', type: 'Parking', city: 'Tirana', address: 'Rr. Ismail Qemali 27, Tirana 1019', distance: '2.0 km', hours: [['Every day', '07:00 – 22:00']], hoursShort: 'Every day 07:00–22:00', status: 'Active', vehicles: 4, today: { pickups: 1, returns: 1 }, instructions: 'Underground level −1, spaces 14–18. Ring the attendant at the barrier.', map: { x: 41, y: 60 } },
    'airport': { id: 'airport', name: 'Tirana Airport (TIA)', short: 'Tirana Airport', type: 'Airport', city: 'Rinas', address: 'Tirana International Airport Nënë Tereza, Rinas 1504', distance: '17 km', hours: [['Every day', '24 hours']], hoursShort: '24 hours, 7 days', status: 'Active', vehicles: 3, today: { pickups: 0, returns: 1 }, instructions: 'Meet at the rental desk in the arrivals hall, then walk to P2, row C.', map: { x: 82, y: 14 } },
    'durres-port': { id: 'durres-port', name: 'Durrës Port Office', short: 'Durrës Port', type: 'Office', city: 'Durrës', address: 'Rr. Tregtare 12, Durrës 2001', distance: '36 km', hours: [['Mon – Sat', '08:00 – 19:00'], ['Sunday', 'Closed']], hoursShort: 'Mon–Sat 08:00–19:00 · Sun closed', status: 'Inactive', vehicles: 0, today: { pickups: 0, returns: 0 }, instructions: 'Seasonal office, reopens in April.', map: { x: 8, y: 30 } },
    'komuna-parisit': { id: 'komuna-parisit', name: 'Komuna e Parisit', short: 'Komuna e Parisit', type: 'Parking', city: 'Tirana', address: 'Rr. Medar Shtylla 8, Tirana', distance: '2.4 km', hours: [['Every day', '08:00 – 21:00']], hoursShort: 'Every day 08:00–21:00', status: 'Active', vehicles: 2, map: { x: 30, y: 72 } },
    'teg': { id: 'teg', name: 'Tirana East Gate (TEG)', short: 'TEG Mall', type: 'Parking', city: 'Tirana', address: 'Autostrada Tiranë–Elbasan, km 3', distance: '6.5 km', hours: [['Every day', '09:00 – 22:00']], hoursShort: 'Every day 09:00–22:00', status: 'Active', vehicles: 6, map: { x: 74, y: 78 } }
  };

  var EQUIP = {
    ac: ['snowflake', 'Air conditioning'], gps: ['navigation', 'GPS navigation'], bt: ['bluetooth', 'Bluetooth'],
    cam: ['camera', 'Rear camera'], carplay: ['phoneLink', 'Apple CarPlay & Android Auto'], cruise: ['gauge', 'Cruise control'],
    child: ['baby', 'Child seat on request'], heated: ['sun', 'Heated seats'], sensors: ['route', 'Parking sensors']
  };

  function gallery(src) {
    return [
      { src: src, pos: '50% 55%', zoom: 1 },
      { src: src, pos: '82% 62%', zoom: 2.1 },
      { src: src, pos: '22% 72%', zoom: 2.3 },
      { src: src, pos: '45% 35%', zoom: 1.7 },
      { src: src, pos: '62% 80%', zoom: 2.6 }
    ];
  }

  var vehicles = [
    { id: 'mercedes-c', make: 'Mercedes-Benz', model: 'C-Class', trim: 'C 220 d AMG Line', year: 2023, category: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 12000, rating: 4.9, reviews: 38, provider: 'tirana-drive', location: 'tirana-center', plate: 'AA 482 KL', color: 'Spectral blue', availability: 'available', badge: 'Top rated', image: IMG + 'cars/mercedes-c-class.jpg', equipment: ['ac', 'gps', 'bt', 'cam', 'carplay', 'cruise', 'heated', 'sensors', 'child'], deposit: 30000, minAge: 25, licenseYears: 3,
      gallery: [
        { src: IMG + 'cars/mercedes-c-class.jpg', pos: '50% 50%', zoom: 1 },
        { src: IMG + 'cars/mercedes-c-class-front.jpg', pos: '50% 50%', zoom: 1 },
        { src: IMG + 'cars/mercedes-c-class-profile.jpg', pos: '50% 50%', zoom: 1 },
        { src: IMG + 'cars/mercedes-c-class-wheel.jpg', pos: '50% 50%', zoom: 1 },
        { src: IMG + 'cars/mercedes-c-class-rear.jpg', pos: '50% 50%', zoom: 1 }
      ],
      description: 'The 2023 C 220 d pairs a quiet, frugal diesel with Mercedes’ latest MBUX cabin — ideal for the motorway to Durrës or the coastal road to Vlorë. Kept by Tirana Drive under a strict service plan, professionally cleaned after every rental and delivered with a full tank.' },
    { id: 'bmw-3', make: 'BMW', model: '3 Series', trim: '320d M Sport', year: 2022, category: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 10500, rating: 4.8, reviews: 24, provider: 'albania-premium', location: 'blloku', plate: 'AD 655 LS', color: 'Alpine white', availability: 'available', badge: '', image: IMG + 'cars/bmw-3-series.jpg', equipment: ['ac', 'gps', 'bt', 'cam', 'carplay', 'cruise', 'sensors'], deposit: 30000, minAge: 25, licenseYears: 3 },
    { id: 'vw-golf', make: 'Volkswagen', model: 'Golf', trim: '1.5 TSI Life', year: 2022, category: 'Compact', transmission: 'Manual', fuel: 'Petrol', seats: 5, doors: 5, bags: 2, price: 4500, rating: 4.7, reviews: 56, provider: 'tirana-drive', location: 'tirana-center', plate: 'AB 123 CD', color: 'Reflex silver', availability: 'limited', badge: '', image: IMG + 'cars/vw-golf.jpg', equipment: ['ac', 'bt', 'carplay', 'sensors', 'child'], deposit: 15000, minAge: 21, licenseYears: 2 },
    { id: 'audi-a4', make: 'Audi', model: 'A4', trim: '35 TDI S line', year: 2021, category: 'Luxury', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 4, bags: 3, price: 9500, rating: 4.6, reviews: 19, provider: 'adriatik-auto', location: 'teg', plate: 'AD 902 TR', color: 'Daytona grey', availability: 'available', badge: '', image: IMG + 'cars/audi-a4.jpg', equipment: ['ac', 'gps', 'bt', 'carplay', 'cruise', 'sensors'], deposit: 25000, minAge: 23, licenseYears: 2 },
    { id: 'toyota-corolla', make: 'Toyota', model: 'Corolla', trim: '1.8 Hybrid', year: 2023, category: 'Compact', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 5, bags: 2, price: 4800, rating: 4.8, reviews: 41, provider: 'rinas-rentals', location: 'airport', plate: 'AB 774 MN', color: 'Bronze metallic', availability: 'available', badge: 'Hybrid', image: IMG + 'cars/toyota-corolla.jpg', equipment: ['ac', 'bt', 'cam', 'carplay', 'cruise'], deposit: 15000, minAge: 21, licenseYears: 2 },
    { id: 'kia-sportage', make: 'Kia', model: 'Sportage', trim: '1.6 T-GDi GT-Line', year: 2023, category: 'SUV', transmission: 'Automatic', fuel: 'Petrol', seats: 5, doors: 5, bags: 4, price: 8000, rating: 4.8, reviews: 31, provider: 'tirana-drive', location: 'tirana-center', plate: 'AC 321 JK', color: 'Black pearl', availability: 'available', badge: '', image: IMG + 'cars/kia-sportage.jpg', equipment: ['ac', 'gps', 'bt', 'cam', 'carplay', 'cruise', 'heated', 'sensors'], deposit: 20000, minAge: 23, licenseYears: 2 },
    { id: 'hyundai-tucson', make: 'Hyundai', model: 'Tucson', trim: '1.6 CRDi', year: 2022, category: 'SUV', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, bags: 4, price: 8500, rating: 4.5, reviews: 12, provider: 'ilir-d', location: 'komuna-parisit', plate: 'AA 640 HT', color: 'White cream', availability: 'available', badge: '', image: IMG + 'cars/hyundai-tucson.jpg', equipment: ['ac', 'bt', 'cam', 'sensors'], deposit: 20000, minAge: 23, licenseYears: 2 },
    { id: 'dacia-duster', make: 'Dacia', model: 'Duster', trim: '1.5 dCi 4x4', year: 2022, category: 'SUV', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, bags: 3, price: 5000, rating: 0, reviews: 0, provider: 'rinas-rentals', location: 'airport', plate: 'AC 118 PZ', color: 'Atacama orange', availability: 'available', badge: '', image: IMG + 'cars/dacia-duster.jpg', equipment: ['ac', 'bt', 'gps'], deposit: 15000, minAge: 21, licenseYears: 2 },
    { id: 'toyota-yaris', make: 'Toyota', model: 'Yaris', trim: '1.5 Hybrid', year: 2022, category: 'Economy', transmission: 'Automatic', fuel: 'Hybrid', seats: 5, doors: 5, bags: 2, price: 3500, rating: 4.7, reviews: 63, provider: 'tirana-drive', location: 'blloku', plate: 'AA 789 GH', color: 'Cyan blue', availability: 'limited', badge: 'Best value', image: IMG + 'cars/toyota-yaris.jpg', equipment: ['ac', 'bt', 'cam', 'carplay'], deposit: 10000, minAge: 19, licenseYears: 1 },
    { id: 'mercedes-v', make: 'Mercedes-Benz', model: 'V-Class', trim: 'V 250 d Avantgarde', year: 2021, category: 'Van', transmission: 'Automatic', fuel: 'Diesel', seats: 8, doors: 5, bags: 6, price: 16000, rating: 4.9, reviews: 14, provider: 'albania-premium', location: 'airport', plate: 'AE 210 VK', color: 'Obsidian black', availability: 'available', badge: '8 seats', image: IMG + 'cars/mercedes-v-class.jpg', equipment: ['ac', 'gps', 'bt', 'cam', 'carplay', 'cruise', 'sensors', 'child'], deposit: 40000, minAge: 25, licenseYears: 3 },
    { id: 'skoda-octavia', make: 'Škoda', model: 'Octavia Combi', trim: '2.0 TDI Style', year: 2021, category: 'Compact', transmission: 'Manual', fuel: 'Diesel', seats: 5, doors: 5, bags: 4, price: 5200, rating: 4.6, reviews: 27, provider: 'adriatik-auto', location: 'teg', plate: 'AA 350 RB', color: 'Velvet red', availability: 'available', badge: '', image: IMG + 'cars/skoda-octavia.jpg', equipment: ['ac', 'gps', 'bt', 'carplay', 'cruise', 'sensors'], deposit: 15000, minAge: 21, licenseYears: 2 },
    { id: 'bmw-x5', make: 'BMW', model: 'X5', trim: 'xDrive30d', year: 2021, category: 'SUV', transmission: 'Automatic', fuel: 'Diesel', seats: 5, doors: 5, bags: 5, price: 18000, rating: 4.9, reviews: 9, provider: 'albania-premium', location: 'blloku', plate: 'AF 077 BX', color: 'Carbon black', availability: 'limited', badge: 'Premium', image: IMG + 'cars/bmw-x5.jpg', equipment: ['ac', 'gps', 'bt', 'cam', 'carplay', 'cruise', 'heated', 'sensors', 'child'], deposit: 50000, minAge: 25, licenseYears: 3 }
  ];

  vehicles.forEach(function (v) {
    v.name = v.make + ' ' + v.model;
    if (!v.gallery) v.gallery = gallery(v.image);
    if (!v.description) v.description = 'A well-kept ' + v.year + ' ' + v.name + ' (' + v.trim + ') with ' + v.transmission.toLowerCase() + ' transmission, ' + v.seats + ' seats and room for ' + v.bags + ' bags. Cleaned and checked after every rental, delivered with a full tank.';
    v.fuelPolicy = 'Full to full';
    v.extraDriver = v.price >= 9000 ? 'Allowed · free of charge' : 'Allowed · 800 ALL per day';
    v.insurance = v.category === 'Economy' ? 'TPL (third-party liability)' : 'TPL + CASCO (own-damage cover)';
  });

  var categories = [
    { id: 'Economy', label: 'Economy', blurb: 'Easy to park, light on fuel', from: 3000, count: 214, icon: 'car', image: IMG + 'cars/toyota-yaris.jpg' },
    { id: 'Compact', label: 'Compact', blurb: 'Room for four and the luggage', from: 4200, count: 298, icon: 'car', image: IMG + 'cars/vw-golf.jpg' },
    { id: 'SUV', label: 'SUV', blurb: 'Mountain roads and the Riviera', from: 5000, count: 263, icon: 'route', image: IMG + 'cars/kia-sportage.jpg' },
    { id: 'Luxury', label: 'Luxury', blurb: 'Business trips and big occasions', from: 9000, count: 121, icon: 'award', image: IMG + 'cars/mercedes-c-class.jpg' },
    { id: 'Van', label: 'Van', blurb: 'Seven to nine seats for groups', from: 9500, count: 74, icon: 'users', image: IMG + 'cars/mercedes-v-class.jpg' }
  ];

  var places = [
    { id: 'tirana', name: 'Tirana', sub: 'City center · 412 cars', type: 'City', image: IMG + 'places/tirana.jpg' },
    { id: 'tia', name: 'Tirana International Airport', sub: 'Rinas (TIA) · 236 cars', type: 'Airport', image: '' },
    { id: 'durres', name: 'Durrës', sub: 'Port & beach · 168 cars', type: 'City', image: IMG + 'places/durres.jpg' },
    { id: 'vlore', name: 'Vlorë', sub: 'Lungomare · 121 cars', type: 'City', image: IMG + 'places/vlore.jpg' },
    { id: 'sarande', name: 'Sarandë', sub: 'Riviera & Ksamil · 94 cars', type: 'City', image: IMG + 'places/ksamil.jpg' },
    { id: 'shkoder', name: 'Shkodër', sub: 'North · 38 cars', type: 'City', image: '' },
    { id: 'blloku', name: 'Blloku, Tirana', sub: 'Neighbourhood', type: 'Area', image: '' },
    { id: 'durres-port', name: 'Durrës Ferry Port', sub: 'Port', type: 'Port', image: '' }
  ];

  var reviews = [
    { name: 'Arben H.', date: '2 Nov 2026', rating: 5, text: 'Spotless car and a very smooth pickup at the office — paperwork took five minutes. Drove it down to Sarandë and back; quiet, comfortable and still under 6 L/100 km.', reply: 'Faleminderit, Arben! Glad the trip south went well — see you next time.', edited: false },
    { name: 'Julia M.', date: '24 Oct 2026', rating: 5, text: 'We landed late and the team waited for us at the office without complaint. Car was exactly as pictured, child seat already fitted.', reply: '', edited: false },
    { name: 'Dritan L.', date: '11 Oct 2026', rating: 4, text: 'Great car, clear rules. The deposit hold took three working days to be released by my bank, so plan for that.', reply: 'Thanks Dritan — the release time depends on the card issuer, we unlock it the same day you return.', edited: true },
    { name: 'Sofia M.', date: '28 Sep 2026', rating: 5, text: 'Took the C-Class over the Llogara pass. Brilliant on the bends, and the full-to-full policy was easy — petrol station 300 m from the office.', reply: '', edited: false }
  ];
  var ratingBreakdown = [[5, 34], [4, 4], [3, 0], [2, 0], [1, 0]];

  // ---- Rental provider (Tirana Drive) back-office data -------------------------------------
  var owner = {
    name: 'Erion Kola', first: 'Erion', company: 'Tirana Drive', email: 'erion@tiranadrive.al', initials: 'EK',
    kpis: { vehicles: 12, activeVehicles: 11, upcoming: 23, next7: 9, revenue: 486400, revenueCard: 312560, revenueCash: 173840, commissionDue: 26076, occupancy: 44, revenueDelta: 12.4, upcomingDelta: 8 },
    revenueMonths: [['Jun', 412000], ['Jul', 598500], ['Aug', 642300], ['Sep', 455800], ['Oct', 432600], ['Nov', 486400]]
  };

  var fleet = [
    { id: 'mercedes-c', name: 'Mercedes-Benz C-Class', trim: 'C 220 d', plate: 'AA 482 KL', category: 'Luxury', location: 'Center Office', price: 12000, status: 'Active', today: 'On rent · until 17 Nov', todayType: 'rented', image: IMG + 'cars/mercedes-c-class.jpg', year: 2023, trips: 41 },
    { id: 'vw-golf', name: 'Volkswagen Golf', trim: '1.5 TSI', plate: 'AB 123 CD', category: 'Compact', location: 'Center Office', price: 4500, status: 'Active', today: 'On rent · until 17 Nov', todayType: 'rented', image: IMG + 'cars/vw-golf.jpg', year: 2022, trips: 63 },
    { id: 'vw-golf-2', name: 'Volkswagen Golf', trim: '1.5 TSI', plate: 'AB 456 EF', category: 'Compact', location: 'Blloku Parking', price: 4500, status: 'Active', today: 'Service · 17–19 Nov', todayType: 'available', image: IMG + 'cars/vw-golf.jpg', year: 2022, trips: 58 },
    { id: 'kia-sportage', name: 'Kia Sportage', trim: '1.6 T-GDi', plate: 'AC 321 JK', category: 'SUV', location: 'Center Office', price: 8000, status: 'Active', today: 'Return today · 12:00', todayType: 'return', image: IMG + 'cars/kia-sportage.jpg', year: 2023, trips: 37 },
    { id: 'toyota-yaris', name: 'Toyota Yaris', trim: '1.5 Hybrid', plate: 'AA 789 GH', category: 'Economy', location: 'Blloku Parking', price: 3500, status: 'Active', today: 'Pickup today · 17:30', todayType: 'pickup', image: IMG + 'cars/toyota-yaris.jpg', year: 2022, trips: 72 },
    { id: 'audi-a4', name: 'Audi A4', trim: '35 TDI', plate: 'AD 902 TR', category: 'Luxury', location: 'Center Office', price: 9500, status: 'Active', today: 'Return today · 18:00', todayType: 'return', image: IMG + 'cars/audi-a4.jpg', year: 2021, trips: 29 },
    { id: 'toyota-corolla', name: 'Toyota Corolla', trim: '1.8 Hybrid', plate: 'AB 774 MN', category: 'Compact', location: 'Tirana Airport', price: 4800, status: 'Active', today: 'On rent · until 19 Nov', todayType: 'rented', image: IMG + 'cars/toyota-corolla.jpg', year: 2023, trips: 34 },
    { id: 'mercedes-v', name: 'Mercedes-Benz V-Class', trim: 'V 250 d', plate: 'AE 210 VK', category: 'Van', location: 'Tirana Airport', price: 16000, status: 'Active', today: 'Available', todayType: 'available', image: IMG + 'cars/mercedes-v-class.jpg', year: 2021, trips: 18 },
    { id: 'dacia-duster', name: 'Dacia Duster', trim: '1.5 dCi 4x4', plate: 'AC 118 PZ', category: 'SUV', location: 'Tirana Airport', price: 5000, status: 'Active', today: 'Available', todayType: 'available', image: IMG + 'cars/dacia-duster.jpg', year: 2022, trips: 0 },
    { id: 'bmw-3', name: 'BMW 3 Series', trim: '320d', plate: 'AD 655 LS', category: 'Luxury', location: 'Blloku Parking', price: 10500, status: 'Active', today: 'Available', todayType: 'available', image: IMG + 'cars/bmw-3-series.jpg', year: 2022, trips: 22 },
    { id: 'hyundai-tucson', name: 'Hyundai Tucson', trim: '1.6 CRDi', plate: 'AA 640 HT', category: 'SUV', location: 'Center Office', price: 8500, status: 'Active', today: 'Blocked · personal use', todayType: 'blocked', image: IMG + 'cars/hyundai-tucson.jpg', year: 2022, trips: 15 },
    { id: 'skoda-octavia', name: 'Škoda Octavia Combi', trim: '2.0 TDI', plate: 'AA 350 RB', category: 'Compact', location: 'Durrës Port', price: 5200, status: 'Inactive', today: 'Not listed', todayType: 'inactive', image: IMG + 'cars/skoda-octavia.jpg', year: 2021, trips: 47 }
  ];

  // status: Pending payment | Confirmed | In progress | Completed | Cancelled | No-show
  var reservations = [
    { code: 'RC-1048', customer: 'Klea Shehu', email: 'klea.shehu@gmail.com', vehicle: 'Volkswagen Golf', plate: 'AB 123 CD', pickup: '18 Nov, 10:00', ret: '21 Nov, 10:00', days: 3, total: 13500, payment: 'Card', status: 'Confirmed', location: 'Center Office', created: '14 Nov, 09:12' },
    { code: 'RC-1047', customer: 'Sofia Marku', email: 'sofia.marku@yahoo.com', vehicle: 'Kia Sportage', plate: 'AC 321 JK', pickup: '16 Nov, 14:00', ret: '20 Nov, 14:00', days: 4, total: 32000, payment: 'Cash', status: 'Confirmed', location: 'Center Office', created: '13 Nov, 18:40' },
    { code: 'RC-1046', customer: 'Besnik Gjoka', email: 'besnik.gjoka@outlook.com', vehicle: 'Mercedes-Benz V-Class', plate: 'AE 210 VK', pickup: '15 Nov, 08:00', ret: '18 Nov, 08:00', days: 3, total: 48000, payment: 'Card', status: 'Confirmed', location: 'Tirana Airport', created: '12 Nov, 11:05' },
    { code: 'RC-1045', customer: 'Dritan Leka', email: 'dritan.leka@gmail.com', vehicle: 'Toyota Yaris', plate: 'AA 789 GH', pickup: '14 Nov, 17:30', ret: '16 Nov, 17:30', days: 2, total: 7000, payment: 'Cash', status: 'Confirmed', location: 'Blloku Parking', created: '11 Nov, 20:31' },
    { code: 'RC-1044', customer: 'Julia Müller', email: 'julia.mueller@web.de', vehicle: 'Mercedes-Benz C-Class', plate: 'AA 482 KL', pickup: '14 Nov, 14:00', ret: '17 Nov, 14:00', days: 3, total: 36000, payment: 'Card', status: 'In progress', location: 'Center Office', created: '9 Nov, 16:22' },
    { code: 'RC-1041', customer: 'Tom Harris', email: 'tom.harris@icloud.com', vehicle: 'Toyota Corolla', plate: 'AB 774 MN', pickup: '13 Nov, 09:00', ret: '19 Nov, 09:00', days: 6, total: 28800, payment: 'Card', status: 'In progress', location: 'Tirana Airport', created: '2 Nov, 08:47' },
    { code: 'RC-1031', customer: 'Marco Rossi', email: 'marco.rossi@libero.it', vehicle: 'Volkswagen Golf', plate: 'AB 123 CD', pickup: '14 Nov, 10:00', ret: '17 Nov, 10:00', days: 3, total: 13500, payment: 'Card', status: 'In progress', location: 'Center Office', created: '30 Oct, 13:10' },
    { code: 'RC-1053', customer: 'Megi Çela', email: 'megi.cela@gmail.com', vehicle: 'Audi A4', plate: 'AD 902 TR', pickup: '27 Dec, 10:00', ret: '3 Jan, 10:00', days: 7, total: 59850, payment: 'Card', status: 'Pending payment', location: 'Center Office', created: '14 Nov, 08:02' },
    { code: 'RC-1036', customer: 'Anna Kowalski', email: 'anna.kowalski@wp.pl', vehicle: 'Kia Sportage', plate: 'AC 321 JK', pickup: '11 Nov, 12:00', ret: '14 Nov, 12:00', days: 3, total: 24000, payment: 'Cash', status: 'Completed', location: 'Center Office', created: '28 Oct, 10:15' },
    { code: 'RC-1029', customer: 'Lukas Weber', email: 'lukas.weber@gmx.de', vehicle: 'Audi A4', plate: 'AD 902 TR', pickup: '10 Nov, 18:00', ret: '14 Nov, 18:00', days: 4, total: 38000, payment: 'Card', status: 'Completed', location: 'Center Office', created: '25 Oct, 19:52' },
    { code: 'RC-1024', customer: 'Arben Hoxha', email: 'arben.hoxha@gmail.com', vehicle: 'Volkswagen Golf', plate: 'AB 123 CD', pickup: '10 Nov, 09:00', ret: '14 Nov, 09:00', days: 4, total: 18000, payment: 'Cash', status: 'Completed', location: 'Center Office', created: '21 Oct, 07:38' },
    { code: 'RC-1022', customer: 'Ergys Basha', email: 'ergys.basha@gmail.com', vehicle: 'Hyundai Tucson', plate: 'AA 640 HT', pickup: '8 Nov, 09:00', ret: '10 Nov, 09:00', days: 2, total: 17000, payment: 'Card', status: 'Cancelled', location: 'Center Office', created: '19 Oct, 15:00' },
    { code: 'RC-1019', customer: 'Elira Dervishi', email: 'elira.dervishi@gmail.com', vehicle: 'Mercedes-Benz C-Class', plate: 'AA 482 KL', pickup: '2 Nov, 10:00', ret: '5 Nov, 10:00', days: 3, total: 36000, payment: 'Cash', status: 'No-show', location: 'Center Office', created: '15 Oct, 12:44' }
  ];

  var today = {
    label: 'Saturday, 14 November 2026',
    pickups: [
      { time: '10:00', code: 'RC-1031', customer: 'Marco Rossi', vehicle: 'Volkswagen Golf', plate: 'AB 123 CD', location: 'Center Office', days: 3, payment: 'Card', done: true },
      { time: '14:00', code: 'RC-1044', customer: 'Julia Müller', vehicle: 'Mercedes-Benz C-Class', plate: 'AA 482 KL', location: 'Center Office', days: 3, payment: 'Card', done: true },
      { time: '17:30', code: 'RC-1045', customer: 'Dritan Leka', vehicle: 'Toyota Yaris', plate: 'AA 789 GH', location: 'Blloku Parking', days: 2, payment: 'Cash', done: false }
    ],
    returns: [
      { time: '09:00', code: 'RC-1024', customer: 'Arben Hoxha', vehicle: 'Volkswagen Golf', plate: 'AB 123 CD', location: 'Center Office', done: true },
      { time: '12:00', code: 'RC-1036', customer: 'Anna Kowalski', vehicle: 'Kia Sportage', plate: 'AC 321 JK', location: 'Center Office', done: true },
      { time: '18:00', code: 'RC-1029', customer: 'Lukas Weber', vehicle: 'Audi A4', plate: 'AD 902 TR', location: 'Center Office', done: false }
    ]
  };

  var notifications = [
    { icon: 'calendarCheck', title: 'New reservation RC-1048', text: 'Klea Shehu · Volkswagen Golf · 18–21 Nov', time: '12 min ago', unread: true },
    { icon: 'card', title: 'Payment captured · RC-1031', text: '13,500 ALL — your share 11,138 ALL after commission and POK fee', time: '1 h ago', unread: true },
    { icon: 'star', title: 'New 5-star review', text: 'Arben H. on Mercedes-Benz C-Class', time: '3 h ago', unread: true },
    { icon: 'receipt', title: 'October commission invoice', text: 'Invoice INV-2026-10-TD issued · 24,310 ALL', time: 'Yesterday', unread: false }
  ];

  var messagesEmpty = true;

  // ---- Platform administration ----------------------------------------------------------------
  var admin = {
    name: 'Ardita Prifti', role: 'Administrator', initials: 'AP',
    kpis: { users: 4286, usersDelta: 312, providers: 184, providersDelta: 11, vehicles: 1027, activeVehicles: 962, reservations: 12904, reservationsMonth: 1148, reservationsDelta: 9.6, commission: 1972400, commissionCard: 1218600, commissionCash: 753800, unpaidInvoices: 7, unpaidAmount: 186200, providerCancellations: 23 },
    byStatus: [['Completed', 468], ['Confirmed', 412], ['In progress', 186], ['Cancelled', 39], ['Pending payment', 37], ['No-show', 6]],
    daily: [[1, 31], [2, 28], [3, 36], [4, 40], [5, 38], [6, 47], [7, 52], [8, 44], [9, 33], [10, 37], [11, 41], [12, 45], [13, 58], [14, 23]]
  };

  var registrations = [
    { name: 'Megi Çela', email: 'megi.cela@gmail.com', role: 'Customer', city: 'Tirana', date: '14 Nov, 08:01', status: 'Active' },
    { name: 'Vlora Premium Rentals', email: 'info@vlorapremium.al', role: 'Provider · Business', city: 'Vlorë', date: '14 Nov, 07:46', status: 'Active' },
    { name: 'Lukas Weber', email: 'lukas.weber@gmx.de', role: 'Customer', city: 'Munich', date: '13 Nov, 22:18', status: 'Active' },
    { name: 'Gentian Muça', email: 'gentian.muca@gmail.com', role: 'Provider · Individual', city: 'Sarandë', date: '13 Nov, 17:02', status: 'Active' },
    { name: 'Chloé Martin', email: 'chloe.martin@orange.fr', role: 'Customer', city: 'Lyon', date: '13 Nov, 11:39', status: 'Active' },
    { name: 'Durrës Car Center', email: 'office@durrescars.al', role: 'Provider · Business', city: 'Durrës', date: '12 Nov, 16:55', status: 'Active' }
  ];

  var users = [
    { name: 'Klea Shehu', email: 'klea.shehu@gmail.com', phone: '+355 68 412 0931', role: 'Customer', joined: '3 Feb 2026', reservations: 6, status: 'Active' },
    { name: 'Tirana Drive', email: 'erion@tiranadrive.al', phone: '+355 69 220 4410', role: 'Provider · Business', joined: '12 Jan 2026', reservations: 418, status: 'Active' },
    { name: 'Marco Rossi', email: 'marco.rossi@libero.it', phone: '+39 347 551 2290', role: 'Customer', joined: '30 Oct 2026', reservations: 1, status: 'Active' },
    { name: 'Riviera Cars Sarandë', email: 'book@rivieracars.al', phone: '+355 67 301 8822', role: 'Provider · Business', joined: '8 Mar 2026', reservations: 207, status: 'Suspended' },
    { name: 'Elira Dervishi', email: 'elira.dervishi@gmail.com', phone: '+355 69 774 1203', role: 'Customer', joined: '15 Oct 2026', reservations: 2, status: 'Active' },
    { name: 'Ilir Daci', email: 'ilir.daci@gmail.com', phone: '+355 68 900 3156', role: 'Provider · Individual', joined: '19 May 2026', reservations: 23, status: 'Active' },
    { name: 'Anna Kowalski', email: 'anna.kowalski@wp.pl', phone: '+48 601 224 870', role: 'Customer', joined: '28 Oct 2026', reservations: 1, status: 'Active' },
    { name: 'Deleted user #2291', email: '—', phone: '—', role: 'Customer', joined: '4 Apr 2026', reservations: 3, status: 'Deleted' },
    { name: 'Albania Premium Cars', email: 'hello@albaniapremium.al', phone: '+355 69 555 0190', role: 'Provider · Business', joined: '22 Jan 2026', reservations: 164, status: 'Active' },
    { name: 'Ergys Basha', email: 'ergys.basha@gmail.com', phone: '+355 67 118 4402', role: 'Customer', joined: '19 Oct 2026', reservations: 2, status: 'Suspended' }
  ];

  var adminReservations = [
    { code: 'RC-1048', customer: 'Klea Shehu', provider: 'Tirana Drive', vehicle: 'Volkswagen Golf', pickup: '18 Nov', ret: '21 Nov', total: 13500, payment: 'Card', status: 'Confirmed' },
    { code: 'RC-2213', customer: 'Chloé Martin', provider: 'Rinas Airport Rentals', vehicle: 'Toyota Corolla', pickup: '17 Nov', ret: '24 Nov', total: 30240, payment: 'Card', status: 'Confirmed' },
    { code: 'RC-2209', customer: 'Gent Hysa', provider: 'Adriatik Auto', vehicle: 'Škoda Octavia Combi', pickup: '15 Nov', ret: '18 Nov', total: 15600, payment: 'Cash', status: 'Confirmed' },
    { code: 'RC-1044', customer: 'Julia Müller', provider: 'Tirana Drive', vehicle: 'Mercedes-Benz C-Class', pickup: '14 Nov', ret: '17 Nov', total: 36000, payment: 'Card', status: 'In progress' },
    { code: 'RC-2198', customer: 'Peter Novak', provider: 'Albania Premium Cars', vehicle: 'BMW X5', pickup: '12 Nov', ret: '16 Nov', total: 72000, payment: 'Card', status: 'In progress' },
    { code: 'RC-2240', customer: 'Megi Çela', provider: 'Tirana Drive', vehicle: 'Audi A4', pickup: '27 Dec', ret: '3 Jan', total: 59850, payment: 'Card', status: 'Pending payment' },
    { code: 'RC-2187', customer: 'Sara Leka', provider: 'Riviera Cars Sarandë', vehicle: 'Fiat Panda', pickup: '10 Nov', ret: '13 Nov', total: 9000, payment: 'Cash', status: 'Completed' },
    { code: 'RC-2176', customer: 'Ergys Basha', provider: 'Ilir D.', vehicle: 'Hyundai Tucson', pickup: '8 Nov', ret: '10 Nov', total: 17000, payment: 'Card', status: 'Cancelled' },
    { code: 'RC-2170', customer: 'Elira Dervishi', provider: 'Tirana Drive', vehicle: 'Mercedes-Benz C-Class', pickup: '2 Nov', ret: '5 Nov', total: 36000, payment: 'Cash', status: 'No-show' },
    { code: 'RC-2168', customer: 'Tom Harris', provider: 'Rinas Airport Rentals', vehicle: 'Dacia Duster', pickup: '1 Nov', ret: '6 Nov', total: 25000, payment: 'Card', status: 'Completed' }
  ];

  // ---- Availability calendar (owner) -----------------------------------------------------------
  var calendarVehicles = [
    { id: 'c1', name: 'Mercedes-Benz C-Class', short: 'Mercedes C', plate: 'AA 482 KL' },
    { id: 'c2', name: 'Volkswagen Golf', short: 'VW Golf', plate: 'AB 123 CD' },
    { id: 'c3', name: 'Volkswagen Golf', short: 'VW Golf', plate: 'AB 456 EF' },
    { id: 'c4', name: 'Toyota Yaris', short: 'Toyota Yaris', plate: 'AA 789 GH' },
    { id: 'c5', name: 'Kia Sportage', short: 'Kia Sportage', plate: 'AC 321 JK' },
    { id: 'c6', name: 'Audi A4', short: 'Audi A4', plate: 'AD 902 TR' },
    { id: 'c7', name: 'Toyota Corolla', short: 'Corolla', plate: 'AB 774 MN' },
    { id: 'c8', name: 'Mercedes-Benz V-Class', short: 'Mercedes V', plate: 'AE 210 VK' }
  ];
  // November 2026 — hand-written so it matches the reservations above. Day ranges are inclusive.
  // type: reserved | service | personal | offline (off-platform booking) | buffer
  var calendarNov2026 = [
    ['c1', 2, 5, 'reserved', 'RC-1019 · E. Dervishi'], ['c1', 9, 12, 'reserved', 'RC-1027 · G. Hysa'], ['c1', 14, 17, 'reserved', 'RC-1044 · J. Müller'], ['c1', 18, 18, 'buffer', 'Cleaning buffer'], ['c1', 23, 26, 'reserved', 'RC-1055 · P. Novak'],
    ['c2', 3, 7, 'reserved', 'RC-1015 · S. Leka'], ['c2', 10, 13, 'reserved', 'RC-1024 · A. Hoxha'], ['c2', 14, 16, 'reserved', 'RC-1031 · M. Rossi'], ['c2', 18, 20, 'reserved', 'RC-1048 · K. Shehu'], ['c2', 25, 29, 'reserved', 'RC-1058 · C. Martin'],
    ['c3', 6, 9, 'reserved', 'RC-1021 · L. Bajrami'], ['c3', 17, 19, 'service', 'Service · annual inspection'], ['c3', 21, 24, 'reserved', 'RC-1052 · N. Kola'], ['c3', 27, 30, 'personal', 'Personal use'],
    ['c4', 1, 4, 'reserved', 'RC-1011 · R. Duka'], ['c4', 8, 11, 'offline', 'Off-platform · walk-in'], ['c4', 14, 15, 'reserved', 'RC-1045 · D. Leka'], ['c4', 20, 23, 'reserved', 'RC-1040 · E. Dervishi'],
    ['c5', 5, 9, 'reserved', 'RC-1018 · T. Brahimi'], ['c5', 11, 13, 'reserved', 'RC-1036 · A. Kowalski'], ['c5', 16, 19, 'reserved', 'RC-1047 · S. Marku'], ['c5', 24, 26, 'personal', 'Personal use'],
    ['c6', 1, 6, 'reserved', 'RC-1009 · F. Rama'], ['c6', 10, 13, 'reserved', 'RC-1029 · L. Weber'], ['c6', 23, 25, 'service', 'Service · tyres'], ['c6', 27, 30, 'reserved', 'RC-1060 · M. Çela'],
    ['c7', 4, 8, 'reserved', 'RC-1014 · K. Gjini'], ['c7', 13, 18, 'reserved', 'RC-1041 · T. Harris'], ['c7', 22, 28, 'reserved', 'RC-1054 · J. Smith'],
    ['c8', 6, 8, 'offline', 'Off-platform · phone booking'], ['c8', 15, 17, 'reserved', 'RC-1046 · B. Gjoka'], ['c8', 24, 27, 'reserved', 'RC-1057 · H. Meta']
  ];

  RC.data = {
    now: new Date(2026, 10, 14, 11, 20),  // fixed "today" so the mock data always lines up
    eurRate: 98.6,  // ALL per EUR — indicative Bank of Albania rate used for "≈ €" display only
    search: { location: 'Tirana', pickupDate: '2026-11-18', pickupTime: '10:00', returnDate: '2026-11-21', returnTime: '10:00' },
    providers: providers, locations: locations, equipment: EQUIP, vehicles: vehicles, categories: categories, places: places,
    reviews: reviews, ratingBreakdown: ratingBreakdown, owner: owner, fleet: fleet, reservations: reservations, schedule: today,
    notifications: notifications, messagesEmpty: messagesEmpty, admin: admin, registrations: registrations, users: users,
    adminReservations: adminReservations, calendarVehicles: calendarVehicles, calendarNov2026: calendarNov2026,
    ownerLocations: ['tirana-center', 'blloku', 'airport', 'durres-port'],
    cancellationPolicies: {
      Flexible: 'Free cancellation up to 24 hours before pickup; after that one day of rental is charged.',
      Moderate: 'Free cancellation up to 72 hours before pickup; after that 50% of the total is charged.',
      Strict: 'Free cancellation up to 7 days before pickup; after that 100% of the total is charged.'
    }
  };
})();
