import { configureStore } from '@reduxjs/toolkit';
import { rootReducer, RootState } from '../services/root-reducer';

describe('rootReducer', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: rootReducer
    });
  });

  describe('структура и инициализация', () => {
    it('создаёт стор с правильной структурой', () => {
      const state = store.getState() as RootState;

      expect(state).toHaveProperty('ingredients');
      expect(state).toHaveProperty('burgerConstructor');
      expect(state).toHaveProperty('feed');
      expect(state).toHaveProperty('user');
      expect(state).toHaveProperty('userOrders');
    });

    it('имена срезов соответствуют ожидаемым', () => {
      const state = store.getState() as RootState;

      expect(Object.keys(state)).toEqual([
        'ingredients',
        'burgerConstructor',
        'feed',
        'user',
        'userOrders'
      ]);
    });

    it('начальное состояние каждого среза корректно', () => {
      const state = store.getState() as RootState;

      expect(state.ingredients).toEqual({
        items: [],
        isLoading: false,
        error: null
      });

      expect(state.burgerConstructor).toEqual({
        bun: null,
        ingredients: [],
        orderRequest: false,
        orderModalData: null
      });

      expect(state.feed).toEqual({
        orders: [],
        selectedOrder: null,
        total: 0,
        totalToday: 0,
        feedsLoading: false,
        orderLoading: false,
        error: null
      });

      expect(state.user).toEqual({
        user: null,
        isLoading: false,
        error: null
      });

      expect(state.userOrders).toEqual({
        profileOrders: [],
        profileOrdersLoading: false,
        error: null
      });
    });

    it('неизвестный экшен возвращает то же состояние, что и @@INIT', () => {
      const stateWithUnknown = rootReducer(undefined, {
        type: 'UNKNOWN_ACTION'
      });
      const stateWithInit = rootReducer(undefined, { type: '@@INIT' });

      expect(stateWithUnknown).toEqual(stateWithInit);
    });

    it('экшен, который не обрабатывается ни одним редьюсером не изменяет стейт', () => {
      const initialState = store.getState() as RootState;

      store.dispatch({ type: 'UNKNOWN_ACTION' });

      const currentState = store.getState() as RootState;
      expect(currentState).toEqual(initialState);
    });
  });

  it('неизвестный экшен не вызывает ошибок', () => {
    expect(() => {
      rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    }).not.toThrow();
  });
});
