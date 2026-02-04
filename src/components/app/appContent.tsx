import { useSelector, useDispatch } from '../../services/store';
import {
  userLoadingSelector,
  checkUserAuth
} from '../../services/slices/user-slice';
import {
  ingredientsLoadingSelector,
  fetchIngredients
} from '../../services/slices/ingredients-slice';
import { useEffect } from 'react';
import { Preloader } from '@ui';
import { AppRoutesContent } from './appRoutesContent';

export const AppContent = () => {
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
