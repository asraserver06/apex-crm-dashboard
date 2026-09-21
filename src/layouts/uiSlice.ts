import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '../types';

interface UiState {
  themeMode: ThemeMode;
  siderCollapsed: boolean;
  primaryColor: string;
  customerSelectedRowKeys: React.Key[];
  dealSelectedRowKeys: React.Key[];
}

const getInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('crm_theme_mode');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const initialState: UiState = {
  themeMode: getInitialTheme(),
  siderCollapsed: false,
  primaryColor: '#1677ff', // Default Antd primary blue
  customerSelectedRowKeys: [],
  dealSelectedRowKeys: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('crm_theme_mode', state.themeMode);
    },
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
      localStorage.setItem('crm_theme_mode', action.payload);
    },
    toggleSider: (state) => {
      state.siderCollapsed = !state.siderCollapsed;
    },
    setSiderCollapsed: (state, action: PayloadAction<boolean>) => {
      state.siderCollapsed = action.payload;
    },
    setPrimaryColor: (state, action: PayloadAction<string>) => {
      state.primaryColor = action.payload;
    },
    setCustomerSelectedRowKeys: (state, action: PayloadAction<React.Key[]>) => {
      state.customerSelectedRowKeys = action.payload;
    },
    setDealSelectedRowKeys: (state, action: PayloadAction<React.Key[]>) => {
      state.dealSelectedRowKeys = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setThemeMode,
  toggleSider,
  setSiderCollapsed,
  setPrimaryColor,
  setCustomerSelectedRowKeys,
  setDealSelectedRowKeys,
} = uiSlice.actions;

export default uiSlice.reducer;
