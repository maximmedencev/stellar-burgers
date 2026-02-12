import {
  userSlice,
  registerUser,
  loginUser,
  checkUserAuth
} from '../services/slices/user-slice';

describe('user slice', () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null
  };

  const mockUser = {
    email: 'test@test.com',
    name: 'Тестовый Пользователь'
  };

  describe('registerUser.pending', () => {
    it('устанавливает isLoading в true при начале регистрации', () => {
      const state = userSlice.reducer(initialState, {
        type: registerUser.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('registerUser.fulfilled', () => {
    it('записывает пользователя в стор и устанавливает isLoading в false', () => {
      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: registerUser.fulfilled.type,
          payload: mockUser
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('registerUser.rejected', () => {
    it('записывает ошибку и устанавливает isLoading в false', () => {
      const errorMessage = 'Ошибка регистрации';

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: registerUser.rejected.type,
          payload: errorMessage
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });

  describe('loginUser.pending', () => {
    it('устанавливает isLoading в true при начале входа', () => {
      const state = userSlice.reducer(initialState, {
        type: loginUser.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('loginUser.fulfilled', () => {
    it('записывает пользователя в стор и устанавливает isLoading в false', () => {
      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: loginUser.fulfilled.type,
          payload: mockUser
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('loginUser.rejected', () => {
    it('записывает ошибку и устанавливает isLoading в false', () => {
      const errorMessage = 'Неверный email или пароль';

      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: loginUser.rejected.type,
          payload: errorMessage
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('checkUserAuth.pending', () => {
    it('устанавливает isLoading в true при проверке авторизации', () => {
      const state = userSlice.reducer(initialState, {
        type: checkUserAuth.pending.type
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('checkUserAuth.fulfilled', () => {
    it('записывает пользователя в стор и устанавливает isLoading в false', () => {
      const state = userSlice.reducer(
        { ...initialState, isLoading: true },
        {
          type: checkUserAuth.fulfilled.type,
          payload: mockUser
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
    });
  });

  describe('checkUserAuth.rejected', () => {
    it('очищает пользователя и записывает ошибку при неудачной проверке', () => {
      const errorMessage = 'Требуется авторизация';

      const state = userSlice.reducer(
        {
          ...initialState,
          isLoading: true,
          user: mockUser
        },
        {
          type: checkUserAuth.rejected.type,
          payload: errorMessage
        }
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
    });
  });
});
