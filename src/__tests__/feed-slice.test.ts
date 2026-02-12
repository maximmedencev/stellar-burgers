import {
  feedSlice,
  fetchFeeds,
  fetchOrderById
} from '../services/slices/feed-slice';

describe('feed slice', () => {
  const initialState = {
    orders: [],
    selectedOrder: null,
    total: 0,
    totalToday: 0,
    feedsLoading: false,
    orderLoading: false,
    error: null
  };

  describe('fetchFeeds.pending', () => {
    it('устанавливает feedsLoading в true при начале запроса', () => {
      const state = feedSlice.reducer(initialState, {
        type: fetchFeeds.pending.type
      });

      expect(state.feedsLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('сбрасывает ошибку при начале нового запроса', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка',
        feedsLoading: false
      };

      const state = feedSlice.reducer(stateWithError, {
        type: fetchFeeds.pending.type
      });

      expect(state.feedsLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchFeeds.fulfilled', () => {
    it('записывает данные в стор и устанавливает feedsLoading в false', () => {
      const mockResponse = {
        orders: [
          { _id: 'order-1', number: 1001, status: 'done' },
          { _id: 'order-2', number: 1002, status: 'pending' }
        ],
        total: 150,
        totalToday: 25
      };

      const state = feedSlice.reducer(
        { ...initialState, feedsLoading: true },
        {
          type: fetchFeeds.fulfilled.type,
          payload: mockResponse
        }
      );

      expect(state.feedsLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.orders).toEqual(mockResponse.orders);
      expect(state.total).toBe(150);
      expect(state.totalToday).toBe(25);
    });
  });

  describe('fetchFeeds.rejected', () => {
    it('записывает ошибку в стор и устанавливает feedsLoading в false', () => {
      const errorMessage = 'Ошибка загрузки ленты';

      const state = feedSlice.reducer(
        { ...initialState, feedsLoading: true },
        {
          type: fetchFeeds.rejected.type,
          error: { message: errorMessage }
        }
      );

      expect(state.feedsLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('fetchOrderById.pending', () => {
    it('устанавливает orderLoading в true при начале запроса заказа', () => {
      const state = feedSlice.reducer(initialState, {
        type: fetchOrderById.pending.type
      });

      expect(state.orderLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.selectedOrder).toBeNull();
    });
  });

  describe('fetchOrderById.fulfilled', () => {
    it('записывает заказ в стор и устанавливает orderLoading в false', () => {
      const mockOrder = {
        _id: 'order-123',
        number: 100416,
        status: 'done',
        ingredients: []
      };

      const state = feedSlice.reducer(
        { ...initialState, orderLoading: true },
        {
          type: fetchOrderById.fulfilled.type,
          payload: mockOrder
        }
      );

      expect(state.orderLoading).toBe(false);
      expect(state.selectedOrder).toEqual(mockOrder);
    });
  });

  describe('fetchOrderById.rejected', () => {
    it('записывает ошибку и устанавливает orderLoading в false', () => {
      const errorMessage = 'Ошибка загрузки заказа';

      const state = feedSlice.reducer(
        { ...initialState, orderLoading: true },
        {
          type: fetchOrderById.rejected.type,
          payload: errorMessage
        }
      );

      expect(state.orderLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.selectedOrder).toBeNull();
    });
  });
});
