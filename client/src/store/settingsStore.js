import { create } from 'zustand';
import axios from 'axios';

export const useSettingsStore = create((set) => ({
  settings: {
    announcement_banner: '',
    maintenance_mode: 'false',
    mpesa_name: 'SAINTSPEACEFLYGOD'
  },
  isLoading: false,

  fetchSettings: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get('/api/admin/settings/public'); 
      set({ settings: res.data });
    } catch (err) {
      console.error('Failed to fetch public settings:', err);
    } finally {
      set({ isLoading: false });
    }
  }
}));