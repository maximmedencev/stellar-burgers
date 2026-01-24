import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../../services/slices/constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveUp = () => {
      if (index > 0) {
        dispatch(moveIngredientUp(index));
      }
    };

    const handleMoveDown = () => {
      if (index < totalItems - 1) {
        dispatch(moveIngredientDown(index));
      }
    };

    const handleClose = () => {
      if (ingredient.id) {
        dispatch(removeIngredient(ingredient.id));
      }
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
