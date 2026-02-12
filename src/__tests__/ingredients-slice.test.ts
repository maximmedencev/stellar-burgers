import {
  ingredientsSlice,
  fetchIngredients
} from '../services/slices/ingredients-slice';
import ingredientsData from './data/ingredients.json';

describe('ingredients slice', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  describe('fetchIngredients.pending', () => {
    it('устанавливает isLoading в true при начале запроса', () => {
      const state = ingredientsSlice.reducer(initialState, {
        type: fetchIngredients.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });

    it('сбрасывает ошибку при начале нового запроса', () => {
      const stateWithError = {
        ...initialState,
        error: 'Предыдущая ошибка',
        isLoading: false
      };

      const state = ingredientsSlice.reducer(stateWithError, {
        type: fetchIngredients.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('записывает ингредиенты в стор и устанавливает isLoading в false', () => {
      const mockIngredients = ingredientsData;

      const state = ingredientsSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: fetchIngredients.fulfilled.type,
          payload: mockIngredients
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.items).toEqual(mockIngredients);
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('записывает ошибку в стор и устанавливает isLoading в false', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';

      const state = ingredientsSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: fetchIngredients.rejected.type,
          error: { message: errorMessage }
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });

    it('использует сообщение по умолчанию если нет ошибки', () => {
      const state = ingredientsSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: fetchIngredients.rejected.type,
          error: {}
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки');
    });

    it('сохраняет старые ингредиенты при ошибке', () => {
      const oldIngredients = [
        { _id: 'old-1', name: 'Старый ингредиент', type: 'main', price: 100 }
      ] as any[];

      const state = ingredientsSlice.reducer(
        {
          ...initialState,
          items: oldIngredients,
          isLoading: true
        },
        {
          type: fetchIngredients.rejected.type,
          error: { message: 'Ошибка' }
        }
      );

      expect(state.items).toEqual(oldIngredients);
      expect(state.error).toBe('Ошибка');
    });
  });
});
