import {
  createSlice,
  createAsyncThunk,
  createSelector
} from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../root-reducer';

interface IFeedState {
  orders: TOrder[];
  selectedOrder: TOrder | null;
  total: number;
  totalToday: number;
  feedsLoading: boolean;
  orderLoading: boolean;
  error: string | null;
}

const initialState: IFeedState = {
  orders: [],
  selectedOrder: null,
  total: 0,
  totalToday: 0,
  feedsLoading: false,
  orderLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', () =>
  getFeedsApi().then((data) => data)
);

export const fetchOrderById = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('feed/fetchOrderById', (orderId, { rejectWithValue }) =>
  getOrderByNumberApi(orderId)
    .then((response) => {
      if (response.orders && response.orders.length > 0) {
        return response.orders[0];
      }
      throw new Error('Заказ не найден');
    })
    .catch((err) => rejectWithValue(err.message || 'Ошибка загрузки заказа'))
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.feedsLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.feedsLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.feedsLoading = false;
        state.error = action.error?.message || 'Ошибка загрузки ленты';
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.orderLoading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.orderLoading = false;
        state.error = action.payload || 'Ошибка загрузки заказа';
        state.selectedOrder = null;
      });
  }
});

const selectTotal = (state: RootState) => state.feed.total;
const selectTotalToday = (state: RootState) => state.feed.totalToday;

export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectSelectedOrder = (state: RootState) =>
  state.feed.selectedOrder;
export const selectFeedData = createSelector(
  [selectTotal, selectTotalToday],
  (total, totalToday) => ({ total, totalToday })
);

export const feedLoadingSelector = (state: RootState) =>
  state.feed.feedsLoading;
export const orderLoadingSelector = (state: RootState) =>
  state.feed.orderLoading;
