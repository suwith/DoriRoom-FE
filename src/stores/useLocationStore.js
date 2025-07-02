import { create } from 'zustand';

export const useLocationStore = create((set) => ({
  location: { lat: null, lng: null },
  setLocation: (loc) => set({ location: loc }),
  clearLocation: () => set({ location: { lat: null, lng: null } }),
}));
