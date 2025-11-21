export interface Activity {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Product {
  id: string;
  name: string;
  type: 'Simulation' | 'Model' | 'Software' | 'Hardware';
  description: string;
  imageUrl: string;
  author: string;
}

export interface LabFlowStep {
  id: number;
  title: string;
  description: string;
  icon: string; // Lucide icon name
}

export interface Facility {
  id: string;
  name: string;
  status: 'available' | 'maintenance' | 'occupied';
  specs: string;
}

export enum AppMode {
  SCREENSAVER = 'SCREENSAVER', // Auto-rotating content
  INTERACTIVE = 'INTERACTIVE', // User clicked/touched
  ADMIN = 'ADMIN' // Management
}

export enum Section {
  HOME = 'HOME',
  ACTIVITIES = 'ACTIVITIES',
  PRODUCTS = 'PRODUCTS',
  FLOW = 'FLOW',
  FACILITIES = 'FACILITIES',
  DELSIM = 'DELSIM',
  AI_ASSISTANT = 'AI_ASSISTANT'
}