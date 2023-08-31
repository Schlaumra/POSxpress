db.createCollection('users');
db.createCollection('orders');
db.createCollection('printers');
db.createCollection('products');
db.createCollection('settings');

db.users.insert([
  {
    name: 'admin',
    hashedPassword:
      '$2b$10$NoPw5fCBoL9n5W2W0MGPWu6XEITI3dmJpwp6Pocf7Z3XXXE2cCiN2',
    password: null,
    roles: ['waiter', 'admin'],
    tags: [],
  },
  {
    name: 'kellner1',
    hashedPassword:
      '$2b$10$FR6wP6LtRJDQEdEwNCvBV.U3tNgbufYPCB3jE5lxtUOEcHGtOyEvi',
    password: 'qwerty',
    roles: ['waiter'],
    tags: ['Essen', 'Trinken'],
  },
  {
    name: 'kellner2',
    hashedPassword:
      '$2b$10$FR6wP6LtRJDQEdEwNCvBV.U3tNgbufYPCB3jE5lxtUOEcHGtOyEvi',
    password: 'qwerty',
    roles: ['waiter'],
    tags: ['Essen'],
  },
  {
    name: 'kellner3',
    hashedPassword:
      '$2b$10$FR6wP6LtRJDQEdEwNCvBV.U3tNgbufYPCB3jE5lxtUOEcHGtOyEvi',
    password: 'qwerty',
    roles: ['waiter'],
    tags: ['Essen', 'Trinken'],
  },
]);

db.settings.insert({
  version: 1,
  tables: 1000,
  tags: ['Essen', 'Trinken'],
});

db.products.insert([
  {
    name: 'Pizza',
    price: 10.42,
    tags: ['Essen'],
    inStock: true,
    info: 'Vollkorn',
    ingredients: [
      { name: 'Tomatensouce', contained: true, extraPrice: 0 },
      { name: 'Mozarella', contained: true, extraPrice: 0 },
      { name: 'Salami', contained: false, extraPrice: 0.1 },
    ],
  },
  {
    name: 'Burger',
    price: 8.5,
    tags: ['Essen'],
    inStock: false,
    ingredients: [
      { name: 'Tomaten', contained: true, extraPrice: 0 },
      { name: 'Käse', contained: true, extraPrice: 0 },
    ],
  },
  {
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    name: 'Sprite',
    price: 3,
    tags: ['Trinken'],
    inStock: false,
  },
  {
    name: 'Bier',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    name: 'Hefe-Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: false,
  },
  {
    name: 'Wein',
    price: 3,
    info: '1 Glas',
    tags: ['Trinken'],
    inStock: false,
  },
  {
    name: 'Klopfale',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    name: 'Mineralwasser',
    price: 3,
    info: '0,33ct',
    tags: ['Trinken'],
    inStock: true,
  },
  {
    name: 'Spezi',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    name: 'Skiwasser',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    name: 'Fanta',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
]);

db.printers.insert([
  {
    name: 'Drucker 1',
    address: '192.168.1.1',
    model: 'Epson TM-T20III',
    tags: ['Essen', 'Trinken'],
  },
  {
    name: 'Drucker 2',
    address: '192.168.1.2',
    model: 'Tickoffice RP820-WUE',
    tags: ['Essen'],
  },
  {
    name: 'Drucker 3',
    address: '192.168.1.3',
    model: 'Epson TM-T20III',
    tags: ['Trinken'],
  },
]);
