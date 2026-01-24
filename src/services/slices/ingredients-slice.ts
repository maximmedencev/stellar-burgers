import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import { TIngredient } from '../../utils/types';
import { RootState } from '../root-reducer';
import { createSelector } from '@reduxjs/toolkit';

type IngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: IngredientsState = {
  items: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', (_, { rejectWithValue }) =>
  getIngredientsApi().catch((err) =>
    rejectWithValue(err.message || 'Ошибка загрузки ингредиентов')
  )
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message ?? 'Ошибка загрузки';
      });
  }
});

export const ingredientsSelector = (state: RootState) =>
  state.ingredients.items;
export const ingredientsLoadingSelector = (state: RootState) =>
  state.ingredients.isLoading;
export const errorSelector = (state: RootState) => state.ingredients.error;

export const selectBuns = createSelector([ingredientsSelector], (items) =>
  items.filter((i) => i.type === 'bun')
);
export const selectMains = createSelector([ingredientsSelector], (items) =>
  items.filter((i) => i.type === 'main')
);
export const selectSauces = createSelector([ingredientsSelector], (items) =>
  items.filter((i) => i.type === 'sauce')
);
