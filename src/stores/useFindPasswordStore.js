import { create } from 'zustand';

export const useFindPasswordStore = create((set) => ({
  email: '',
  resetToken: '',
  username: '',
  setEmail: (email) => set({ email }),
  setResetToken: (resetToken) => set({ resetToken }),
  setUsername: (username) => set({ username }),
  reset: () => set({ email: '', resetToken: '', username: '' }),
}));
