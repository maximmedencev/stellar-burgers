import { TOrder } from '@utils-types';
import {
  userOrdersSlice,
  fetchUserOrders
} from '../services/slices/user-orders-slice';

const mockOrder1: TOrder = {
  _id: '696b90afa64177001b327b25',
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093e',
    '643d69a5c3f7b9001cfa093c'
  ],
  status: 'done',
  name: 'Люминесцентный краторный бургер',
  createdAt: '2026-01-17T13:37:51.780Z',
  updatedAt: '2026-01-17T13:37:52.044Z',
  number: 99098
};

const mockOrder2: TOrder = {
  _id: '696b9e74a64177001b327b44',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093d'
  ],
  status: 'done',
  name: 'Био-марсианский флюоресцентный бургер',
  createdAt: '2026-01-17T14:36:36.134Z',
  updatedAt: '2026-01-17T14:36:36.431Z',
  number: 99099
};

const mockOrder3: TOrder = {
  _id: '696ce293a64177001b327ca5',
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0947',
    '643d69a5c3f7b9001cfa093d'
  ],
  status: 'done',
  name: 'Фалленианский флюоресцентный бургер',
  createdAt: '2026-01-18T13:39:31.067Z',
  updatedAt: '2026-01-18T13:39:31.363Z',
  number: 99142
};

describe('userOrders slice', () => {
  const initialState = {
    profileOrders: [],
    profileOrdersLoading: false,
    error: null
  };

  describe('fetchUserOrders.pending', () => {
    it('устанавливает profileOrdersLoading в true при начале запроса', () => {
      const state = userOrdersSlice.reducer(initialState, {
        type: fetchUserOrders.pending.type
      });

      expect(state.profileOrdersLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('сбрасывает ошибку при начале нового запроса', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка',
        profileOrdersLoading: false
      };

      const state = userOrdersSlice.reducer(stateWithError, {
        type: fetchUserOrders.pending.type
      });

      expect(state.profileOrdersLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchUserOrders.fulfilled', () => {
    it('записывает заказы в стор и устанавливает profileOrdersLoading в false', () => {
      const mockOrders: TOrder[] = [mockOrder1, mockOrder2, mockOrder3];

      const state = userOrdersSlice.reducer(
        { ...initialState, profileOrdersLoading: true },
        {
          type: fetchUserOrders.fulfilled.type,
          payload: mockOrders
        }
      );

      expect(state.profileOrdersLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.profileOrders).toEqual(mockOrders);
      expect(state.profileOrders).toHaveLength(3);
      expect(state.profileOrders[0].number).toBe(99098);
      expect(state.profileOrders[1].number).toBe(99099);
      expect(state.profileOrders[2].number).toBe(99142);
    });
  });

  describe('fetchUserOrders.rejected', () => {
    it('записывает ошибку в стор и устанавливает profileOrdersLoading в false', () => {
      const errorMessage = 'Ошибка загрузки заказов';

      const state = userOrdersSlice.reducer(
        { ...initialState, profileOrdersLoading: true },
        {
          type: fetchUserOrders.rejected.type,
          payload: errorMessage
        }
      );

      expect(state.profileOrdersLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.profileOrders).toEqual([]);
    });

    it('использует сообщение по умолчанию если нет ошибки', () => {
      const state = userOrdersSlice.reducer(
        { ...initialState, profileOrdersLoading: true },
        {
          type: fetchUserOrders.rejected.type,
          payload: null
        }
      );

      expect(state.profileOrdersLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказов');
    });

    it('сохраняет старые заказы при ошибке', () => {
      const state = userOrdersSlice.reducer(
        {
          ...initialState,
          profileOrders: [mockOrder1, mockOrder2],
          profileOrdersLoading: true
        },
        {
          type: fetchUserOrders.rejected.type,
          payload: 'Ошибка'
        }
      );

      expect(state.profileOrders).toEqual([mockOrder1, mockOrder2]);
      expect(state.error).toBe('Ошибка');
    });
  });
});
