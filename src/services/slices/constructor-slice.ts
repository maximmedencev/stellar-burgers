import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  createSelector
} from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { RootState } from '../root-reducer';

type ConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
  orderRequest: boolean;
  orderModalData: TOrder | null;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null
};

export type ConstructorItems = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'constructor/createOrder',
  (ingredientsIds) => orderBurgerApi(ingredientsIds).then((data) => data.order)
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      if (action.payload.type === 'bun') return;
      state.ingredients.push(action.payload);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    setBun: (state, action: PayloadAction<TIngredient>) => {
      state.bun = action.payload;
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        [state.ingredients[index - 1], state.ingredients[index]] = [
          state.ingredients[index],
          state.ingredients[index - 1]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.ingredients.length - 1) {
        [state.ingredients[index], state.ingredients[index + 1]] = [
          state.ingredients[index + 1],
          state.ingredients[index]
        ];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.bun = null;
        state.ingredients = [];
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  setBun,
  closeOrderModal,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp
} = constructorSlice.actions;

export const bunSelector = (state: RootState) => state.burgerConstructor.bun;
export const burgerIngredientsSelector = (state: RootState) =>
  state.burgerConstructor.ingredients;
export const orderRequestSelector = (state: RootState) =>
  state.burgerConstructor.orderRequest;
export const orderModalDataSelector = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const constructorItemsSelector = createSelector(
  [bunSelector, burgerIngredientsSelector],
  (bun, ingredients): ConstructorItems => ({
    bun: bun ?? null,
    ingredients
  })
);
