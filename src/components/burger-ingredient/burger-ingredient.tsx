import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '../../services/store';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { addIngredient, setBun } from '../../services/slices/constructor-slice';
import { TConstructorIngredient } from '@utils-types';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        const ingredientToAdd: TConstructorIngredient = {
          ...ingredient,
          id: `${Date.now()}-${Math.random().toString(36)}`
        };
        dispatch(addIngredient(ingredientToAdd));
      }
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
      />
    );
  }
);
