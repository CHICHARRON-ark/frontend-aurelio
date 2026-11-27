import db from "./db.json";

export const USERS = db.users;
export const TECHS = db.techs;
export const PRODUCTS = db.products;
export const CATALOG = db.catalog;
export const CATEGORIES = db.categories;
export const ORDERS = db.orders;
export const PAYMENTS = db.payments;
export const REVIEWS = db.reviews;
export const APPLICATIONS = db.applications;
export const LOG = db.log;

export function createState() {
  return {
    session: null,
    users: structuredClone(USERS),
    techs: structuredClone(TECHS),
    products: structuredClone(PRODUCTS),
    catalog: structuredClone(CATALOG),
    categories: [...CATEGORIES],
    orders: structuredClone(ORDERS),
    payments: structuredClone(PAYMENTS),
    reviews: structuredClone(REVIEWS),
    applications: structuredClone(APPLICATIONS),
    log: structuredClone(LOG),
    filters: { maxPrice: 400, minRating: 4, query: "", active: false },
    draft: null,
    applicationDraft: null,
    cart: null,
    hiddenTechs: [],
  };
}
