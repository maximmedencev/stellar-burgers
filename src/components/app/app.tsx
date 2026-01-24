import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from 'react-router-dom';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';
import { ProtectedRoute } from '../protected-route/protected-route';
import { fetchIngredients } from '../../services/slices/ingredients-slice';
import { checkUserAuth } from '../../services/slices/user-slice';
import { Preloader } from '@ui';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';
import { ingredientsLoadingSelector } from '../../services/slices/ingredients-slice';
import { userLoadingSelector } from '../../services/slices/user-slice';

const AppRoutesContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const matchFeedOrderNumber = useMatch('/feed/:number');
  const matchProfileOrderNumber = useMatch('/profile/orders/:number');
  const feedOrderNumber = matchFeedOrderNumber?.params.number || '';
  const profileOrderNumber = matchProfileOrderNumber?.params.number || '';

  const backgroundPageLocation = location.state?.background;

  return (
    <>
      <Routes location={backgroundPageLocation || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />

        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundPageLocation && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={`#${feedOrderNumber}`} onClose={() => navigate(-1)}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />

          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal
                  title={`#${profileOrderNumber}`}
                  onClose={() => navigate(-1)}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const AppContent = () => {
  const dispatch = useDispatch();

  const isUserLoading = useSelector(userLoadingSelector);
  const isIngredientsLoading = useSelector(ingredientsLoadingSelector);

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(fetchIngredients());
  }, [dispatch]);

  const isLoading = isUserLoading || isIngredientsLoading;

  if (isLoading) {
    return <Preloader />;
  }

  return <AppRoutesContent />;
};

const App = () => (
  <BrowserRouter>
    <div className={styles.app}>
      <AppHeader />
      <AppContent />
    </div>
  </BrowserRouter>
);

export default App;
