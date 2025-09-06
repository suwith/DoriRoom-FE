// store/useFestivalFilterStore.js
import { create } from 'zustand';

export const useFestivalFilterStore = create((set) => ({
  keyword: '',
  regions: [],
  categories: [],
  period: { start: null, end: null },
  sort: '추천순',

  setKeyword: (v) => set({ keyword: v }),
  setRegions: (v) => set({ regions: v }),
  setCategories: (v) => set({ categories: v }),
  setPeriod: (v) => set({ period: v }),
  setSort: (v) => set({ sort: v }),
}));
