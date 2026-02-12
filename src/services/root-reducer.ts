import { combineSlices } from '@reduxjs/toolkit';
import { ingredientsSlice } from './slices/ingredients-slice';
import { constructorSlice } from './slices/constructor-slice';
import { feedSlice } from './slices/feed-slice';
import { userSlice } from './slices/user-slice';
import { userOrdersSlice } from './slices/user-orders-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  constructorSlice,
  feedSlice,
  userSlice,
  userOrdersSlice
);

export type RootState = ReturnType<typeof rootReducer>;
