import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Printer, Product, Settings, User } from 'libs/interface';
import { Observable, from } from 'rxjs';

const USERS: User[] = [
  {id: uuidv4(), name: 'kellner2', password: 'qwerty', tags: ['Essen']},
  {id: uuidv4(), name: 'kellner3', password: 'qwerty', tags: ['Trinken']},
  {id: uuidv4(), name: 'kellner1', password: 'qwerty', tags: ['Essen', 'Trinken']},
];

const PRODUCTS: Product[] = [
  {
    id: uuidv4(),
    name: 'Pizza',
    price: 10.42,
    tags: ['Essen'],
    inStock: true,
    info: "Vollkorn",
    ingredients: [
      { name: 'Tomatensouce', contained: true, extraPrice: 0 },
      { name: 'Mozarella', contained: true, extraPrice: 0 },
      { name: 'Salami', contained: false, extraPrice: 0.10 },
    ],
  },
  {
    id: uuidv4(),
    name: 'Burger',
    price: 8.5,
    tags: ['Essen'],
    inStock: false,
    ingredients: [
      { name: 'Tomaten', contained: true, extraPrice: 0 },
      { name: 'Käse', contained: true, extraPrice: 0 }
    ]
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: false,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: false,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: false,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Cola',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
  {
    id: uuidv4(),
    name: 'Fanta',
    price: 3,
    tags: ['Trinken'],
    inStock: true,
  },
];

const PRINTERS: Printer[] = [
  {
    id: uuidv4(),
    name: "Drucker 1",
    address: "192.168.1.1",
    model: "Epson TM-T20III",
    tags: ["Essen", "Trinken"]
  },
  {
    id: uuidv4(),
    name: "Drucker 2",
    address: "192.168.1.2",
    model: "Tickoffice RP820-WUE",
    tags: ["Essen"]
  },
  {
    id: uuidv4(),
    name: "Drucker 3",
    address: "192.168.1.3",
    model: "Epson TM-T20III",
    tags: ["Trinken"]
  },
]

const SETTINGS: Settings = {
  tables: 15
}

const TAGS: string[] = ["Essen", "Trinken"]

@Injectable({
  providedIn: 'root'
})
export class DataService {
  getUsers(): Observable<User[]> {
    return from([USERS])
  }

  getProducts(): Observable<Product[]> {
    return from([PRODUCTS])
  }

  getPrinters(): Observable<Printer[]> {
    return from([PRINTERS])
  }

  getSettings(): Observable<Settings> {
    return from([SETTINGS])
  }

  getTags(): Observable<string[]> {
    return from([TAGS])
  }
}
