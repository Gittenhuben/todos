import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TItem, TListFilter } from '@/types';
import { defaultListItems } from './defaultData';


export type TListState = {
  counter: number,
  filter: TListFilter,
  items: TItem[]
}

const initialState: TListState = {
  counter: 0,
  filter: 'all',
  items: defaultListItems
};

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: state.counter++,
        completed: false,
        text: action.payload
      })
    },
    changeItemState: (state, action: PayloadAction<number>) => {
      const index = state.items.findIndex(item => item.id === action.payload);
      if (index !== -1) {
        state.items[index].completed = !state.items[index].completed;
      }
    },
    setItemText: (state, action: PayloadAction<Omit<TItem, 'completed'>>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index].text = action.payload.text;
      }
    },
    deleteCompletedItems: (state) => {
      state.items = state.items.filter(item => !item.completed);
    },
    setFilter: (state, action: PayloadAction<TListFilter>) => {
      state.filter = action.payload;
    }
  },
});

export const actions = listSlice.actions;
export const reducer = listSlice.reducer;
