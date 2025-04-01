import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export type StatusSeverity = 'normal' | 'warning' | 'critical';

export interface GlobalStateItem {
  id: string;
  message: string;
  severity: StatusSeverity;
  timestamp: number;
}

interface GlobalStateSlice {
  items: GlobalStateItem[];
}

const initialState: GlobalStateSlice = {
  items: [],
};

export const globalStateSlice = createSlice({
  name: 'globalState',
  initialState,
  reducers: {
    addStateItem: (state, action: PayloadAction<Omit<GlobalStateItem, 'timestamp'>>) => {
      state.items.push({
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    removeStateItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearAllStateItems: (state) => {
      state.items = [];
    },
    resetGlobalState: () => initialState,
  },
});

export const { 
  addStateItem,
  removeStateItem,
  clearAllStateItems,
  resetGlobalState 
} = globalStateSlice.actions;

export default globalStateSlice.reducer; 