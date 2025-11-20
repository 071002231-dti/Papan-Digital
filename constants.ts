import { Activity, Facility, LabFlowStep, Product } from "./types";

export const DEFAULT_ACTIVITIES: Activity[] = [
  {
    id: '1',
    title: 'Workshop Simulasi Diskrit',
    date: '2023-11-15',
    time: '09:00 - 12:00',
    description: 'Pelatihan dasar menggunakan software Arena dan FlexSim untuk mahasiswa tingkat akhir.',
    status: 'upcoming'
  },
  {
    id: '2',
    title: 'Seminar Pemodelan Sistem',
    date: '2023-11-20',
    time: '13:00 - 15:00',
    description: 'Guest Lecture dari Industri Manufaktur mengenai implementasi Digital Twin.',
    status: 'upcoming'
  },
  {
    id: '3',
    title: 'Praktikum Modul 3',
    date: 'Setiap Selasa',
    time: '08:00 - 16:00',
    description: 'Jadwal praktikum reguler untuk mata kuliah Pemodelan Sistem.',
    status: 'ongoing'
  }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Smart Warehouse Sim',
    type: 'Simulation',
    description: 'Simulasi gudang otomatis menggunakan AGV (Automated Guided Vehicle) untuk optimasi rute.',
    imageUrl: 'https://picsum.photos/600/400?random=1',
    author: 'Tim Riset Lab 2023'
  },
  {
    id: '2',
    name: 'Traffic Flow Model',
    type: 'Model',
    description: 'Pemodelan sistem antrian lampu merah di persimpangan padat kota.',
    imageUrl: 'https://picsum.photos/600/400?random=2',
    author: 'Mahasiswa TA'
  },
  {
    id: '3',
    name: 'Supply Chain Dashboard',
    type: 'Software',
    description: 'Dashboard monitoring rantai pasok realtime berbasis web.',
    imageUrl: 'https://picsum.photos/600/400?random=3',
    author: 'Asisten Lab'
  }
];

export const DEFAULT_FLOW: LabFlowStep[] = [
  {
    id: 1,
    title: 'Registrasi',
    description: 'Isi buku tamu digital dan scan KTM pada pintu masuk.',
    icon: 'ClipboardList'
  },
  {
    id: 2,
    title: 'Briefing K3',
    description: 'Baca dan pahami aturan keselamatan kerja di laboratorium.',
    icon: 'ShieldAlert'
  },
  {
    id: 3,
    title: 'Penggunaan Alat',
    description: 'Gunakan PC atau alat simulasi sesuai prosedur (SOP).',
    icon: 'MonitorPlay'
  },
  {
    id: 4,
    title: 'Pelaporan',
    description: 'Laporkan kondisi alat setelah selesai digunakan kepada asisten.',
    icon: 'FileCheck'
  }
];

export const DEFAULT_FACILITIES: Facility[] = [
  { id: '1', name: 'Workstation High-Spec 01', status: 'available', specs: 'i9, RTX 4090, 64GB RAM' },
  { id: '2', name: 'Workstation High-Spec 02', status: 'occupied', specs: 'i9, RTX 4090, 64GB RAM' },
  { id: '3', name: 'VR Simulation Unit', status: 'available', specs: 'Meta Quest 3, Dedicated PC' },
  { id: '4', name: '3D Printer', status: 'maintenance', specs: 'Bambu Lab X1 Carbon' },
  { id: '5', name: 'Smart TV 65"', status: 'available', specs: '4K Presentation Display' },
];

export const LAB_INFO = {
  name: "LABORATORIUM PEMODELAN SISTEM & SIMULASI",
  location: "Gedung T. Industri, Lantai 2",
  coordinator: "Dr. Eng. System",
  openHours: "Mon - Fri: 08:00 - 16:00"
};