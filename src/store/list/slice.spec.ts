import { describe, expect, test } from '@jest/globals';
import type { TItem } from '@/types';
import { listSlice, type TListState } from './slice';
import {
  selectListItems,
  selectListFilter,
  selectFilteredListItems,
  selectActiveItemsCount
} from './selectors';


describe('Проверка слайса листа', () => {

  const task1: TItem = {
    id: 0,
    completed: false,
    text: 'test task 1'
  }

  describe('Проверка редьюсера', () => {
  
    test('Тест инициализации редьюсера', () => {
      const defaultInitialState = listSlice.getInitialState();
      const newState = listSlice.reducer(undefined, { type: 'UNKNOWN_ACTION' });
      expect(newState).toEqual(defaultInitialState);
    });

    test('Тест иммутабельности состояния', () => {
      const initialState: TListState = {
        counter: 1,
        filter: 'all',
        items: [task1]
      };
      const action = { type: 'list/changeItemState', payload: 0};
      const newState = listSlice.reducer(initialState, action);
      const newState2 = listSlice.reducer(newState, action);
      expect(newState2).not.toBe(initialState);
      expect(newState2.items).not.toBe(initialState.items);
    });
  });


  describe('Проверка экшенов', () => {

    test('Тест добавления нового задания', () => {
      const initialState: TListState = {
        counter: 1,
        filter: 'all',
        items: [task1]
      };

      const expectedState: TListState = {
        counter: 2,
        filter: 'all',
        items: [task1, { id: 1, completed: false, text: 'test' }]
      };

      const newState = listSlice.reducer(initialState, {type: 'list/addItem', payload: 'test'});
      expect(newState).toEqual(expectedState);
    });


    test('Тест изменения статуса задания', () => {
      const initialState: TListState = {
        counter: 1,
        filter: 'all',
        items: [{ id: 0, completed: false, text: 'test' }]
      };

      const expectedState: TListState = {
        counter: 1,
        filter: 'all',
        items: [{ id: 0, completed: true, text: 'test' }]
      };

      const newState1 = listSlice.reducer(initialState, {type: 'list/changeItemState', payload: 0});
      expect(newState1).toEqual(expectedState);

      const newState2 = listSlice.reducer(newState1, {type: 'list/changeItemState', payload: 0});
      expect(newState2).toEqual(initialState);

      const newState3 = listSlice.reducer(initialState, {type: 'list/changeItemState', payload: 99});
      expect(newState3).toEqual(initialState);
    });


    test('Тест изменения текста задания', () => {
      const initialState: TListState = {
        counter: 1,
        filter: 'all',
        items: [{ id: 0, completed: false, text: 'test' }]
      };
      
      const expectedState: TListState = {
        counter: 1,
        filter: 'all',
        items: [{ id: 0, completed: false, text: 'test test' }]
      };

      const newState1 = listSlice.reducer(initialState, {
        type: 'list/setItemText',
        payload: { id: 0, text: 'test test'}
      });
      
      expect(newState1).toEqual(expectedState);

      const newState2 = listSlice.reducer(newState1, {
        type: 'list/setItemText',
        payload: { id: 99, text: 'test test test'}
      });

      expect(newState2).toEqual(newState1);
    });


    test('Тест удаления выполненных заданий', () => {
      const initialState: TListState = {
        counter: 5,
        filter: 'all',
        items: [
          { id: 0, completed: false, text: 'test1' },
          { id: 1, completed: true, text: 'test2' },
          { id: 2, completed: false, text: 'test3' },
          { id: 3, completed: true, text: 'test4' },
          { id: 4, completed: false, text: 'test5' },
        ]
      };

      const expectedState: TListState = {
        counter: 5,
        filter: 'all',
        items: [
          { id: 0, completed: false, text: 'test1' },
          { id: 2, completed: false, text: 'test3' },
          { id: 4, completed: false, text: 'test5' },
        ]
      };
      
      const newState = listSlice.reducer(initialState, {type: 'list/deleteCompletedItems'});
      
      expect(newState).toEqual(expectedState);
    });


    test('Тест изменения значения фильтра', () => {

      const initialState: TListState = {
        counter: 1,
        filter: 'all',
        items: [task1]
      };

      const expectedState1: TListState = {...initialState, filter: 'active'};
      const expectedState2: TListState = {...initialState, filter: 'completed'};

      const newState = listSlice.reducer(initialState, {type: 'list/setFilter', payload: 'all'});
      expect(newState).toEqual(initialState);

      const newState2 = listSlice.reducer(newState, {type: 'list/setFilter', payload: 'active'});
      expect(newState2).toEqual(expectedState1);

      const newState3 = listSlice.reducer(newState2, {type: 'list/setFilter', payload: 'completed'});
      expect(newState3).toEqual(expectedState2);

      const newState4 = listSlice.reducer(newState3, {type: 'list/setFilter', payload: 'all'});
      expect(newState4).toEqual(initialState);
    });
  
  });


  describe('Проверка селекторов', () => {
    const items = [
      { id: 0, completed: false, text: 'test1' },
      { id: 1, completed: true, text: 'test2' },
      { id: 2, completed: false, text: 'test3' },
      { id: 3, completed: true, text: 'test4' },
      { id: 4, completed: false, text: 'test5' },
    ];

    const initialState: TListState = {
      counter: 5,
      filter: 'all',
      items
    }

    const initialRootState = {
      list: initialState
    }

    const initialRootStateFilteredCompleted = {
      list: {...initialState, filter: 'completed'} as TListState
    }

    const initialRootStateFilteredActive = {
      list: {...initialState, filter: 'active'} as TListState
    }


    test('Проверка селектора всех заданий', () => {
      const expectedResult = items;
      const result = selectListItems(initialRootState);
      expect(result).toEqual(expectedResult);
    });


    test('Проверка селектора фильтра', () => {
      const expectedResult = 'all';
      const result = selectListFilter(initialRootState);
      expect(result).toEqual(expectedResult);
    });


    test('Проверка селектора отфильтрованных заданий', () => {
      const expectedResult1 = items;
      const result1 = selectFilteredListItems(initialRootState);
      expect(result1).toEqual(expectedResult1);

      const expectedResult2 = items.filter(item => item.completed);
      const result2 = selectFilteredListItems(initialRootStateFilteredCompleted);
      expect(result2).toEqual(expectedResult2);

      const expectedResult3 = items.filter(item => !item.completed);
      const result3 = selectFilteredListItems(initialRootStateFilteredActive);
      expect(result3).toEqual(expectedResult3);
    });


    test('Проверка селектора количества актуальных заданий', () => {
      const expectedResult = 3;
      const result = selectActiveItemsCount(initialRootState);
      expect(result).toEqual(expectedResult);
    });

  });

});
