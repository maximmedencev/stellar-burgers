import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../root-reducer';

interface IUserOrdersState {
  profileOrders: TOrder[];
  profileOrdersLoading: boolean;
  error: string | null;
}

const initialState: IUserOrdersState = {
  profileOrders: [],
  profileOrdersLoading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchUserOrders', (_, { rejectWithValue }) =>
  getOrdersApi()
    .then((orders) => orders)
    .catch((err) => rejectWithValue(err.message || 'Ошибка загрузки заказов'))
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.profileOrdersLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.profileOrdersLoading = false;
        state.profileOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.profileOrdersLoading = false;
        state.error = action.payload || 'Ошибка загрузки заказов';
      });
  }
});

export const selectUserOrders = (state: RootState) =>
  state.userOrders.profileOrders;
export const userOrdersLoadingSelector = (state: RootState) =>
  state.userOrders.profileOrdersLoading;
export const userOrdersErrorSelector = (state: RootState) =>
  state.userOrders.error;
