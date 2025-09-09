import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
 
export const selectListItems = (state: RootState) => state.list.items;
export const selectListFilter = (state: RootState) => state.list.filter;

export const selectFilteredListItems = createSelector(
  selectListItems,
  selectListFilter,
  (items, filter) => {
    switch (filter) {
      case 'active':
        return items.filter(item => !item.completed);
      case 'completed':
        return items.filter(item => item.completed);
      case 'all':
      default:
        return items;
    }
  }
);

export const selectActiveItemsCount = createSelector(
  selectListItems,
  items => items.filter(item => !item.completed).length
);
