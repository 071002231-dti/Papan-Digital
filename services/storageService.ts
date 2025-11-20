import { Activity, Product, Facility, LabFlowStep } from "../types";
import { DEFAULT_ACTIVITIES, DEFAULT_PRODUCTS, DEFAULT_FACILITIES, DEFAULT_FLOW } from "../constants";

const KEYS = {
  ACTIVITIES: 'simlab_activities',
  PRODUCTS: 'simlab_products',
  FACILITIES: 'simlab_facilities',
  FLOW: 'simlab_flow',
};

// Generic getter/setter
const get = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
};

const set = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

export const storageService = {
  getActivities: () => get<Activity[]>(KEYS.ACTIVITIES, DEFAULT_ACTIVITIES),
  saveActivities: (data: Activity[]) => set(KEYS.ACTIVITIES, data),

  getProducts: () => get<Product[]>(KEYS.PRODUCTS, DEFAULT_PRODUCTS),
  saveProducts: (data: Product[]) => set(KEYS.PRODUCTS, data),

  getFacilities: () => get<Facility[]>(KEYS.FACILITIES, DEFAULT_FACILITIES),
  saveFacilities: (data: Facility[]) => set(KEYS.FACILITIES, data),

  getFlow: () => get<LabFlowStep[]>(KEYS.FLOW, DEFAULT_FLOW),
  saveFlow: (data: LabFlowStep[]) => set(KEYS.FLOW, data),
  
  resetDefaults: () => {
    localStorage.clear();
    window.location.reload();
  }
};