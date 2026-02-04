import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { TUser } from '@utils-types';
import { setCookie, getCookie, deleteCookie } from '../../utils/cookie';
import { RootState } from '../root-reducer';

interface UserState {
  user: TUser | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', (userData, { rejectWithValue }) =>
  registerUserApi(userData)
    .then((response) => {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    })
    .catch((err) => {
      const message = err?.message || 'Ошибка регистрации';
      return rejectWithValue(message);
    })
);

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: string }
>('user/login', (loginData, { rejectWithValue }) =>
  loginUserApi(loginData)
    .then((response) => {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    })
    .catch((err) => {
      const message = err?.message || 'Неверный email или пароль';
      return rejectWithValue(message);
    })
);

export const checkUserAuth = createAsyncThunk<
  TUser,
  void,
  { rejectValue: string }
>('user/checkAuth', (_, { rejectWithValue }) => {
  const token = getCookie('accessToken');

  if (!token) {
    return rejectWithValue('Требуется авторизация');
  }

  return getUserApi()
    .then((response) => response.user)
    .catch((err) => {
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      const message = err?.message || 'Требуется авторизация';
      return rejectWithValue(message);
    });
});

export const updateUserData = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: string }
>('user/update', (updateData, { rejectWithValue }) =>
  updateUserApi(updateData)
    .then((response) => response.user)
    .catch((err) => {
      const message = err?.message || 'Ошибка обновления данных';
      return rejectWithValue(message);
    })
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logoutUser',
  (_, { rejectWithValue }) => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (refreshToken) {
      return logoutApi()
        .then(() => {
          localStorage.clear();
          deleteCookie('accessToken');
        })
        .catch((err) => {
          localStorage.clear();
          deleteCookie('accessToken');
          const message = err?.message || 'Ошибка выхода';
          return rejectWithValue(message);
        });
    } else {
      localStorage.clear();
      deleteCookie('accessToken');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка регистрации';
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка авторизации';
      })

      .addCase(checkUserAuth.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload || 'Требуется авторизация';
      })
      .addCase(updateUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Ошибка обновления';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload || 'Ошибка выхода';
      });
  }
});

export const { clearError } = userSlice.actions;

export const userSelector = (state: RootState) => state.user.user;
export const userLoadingSelector = (state: RootState) => state.user.isLoading;
export const userErrorSelector = (state: RootState) => state.user.error;
