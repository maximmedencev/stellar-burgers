import { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { ingredientsSelector } from '../../services/slices/ingredients-slice';
import { useLocation } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const items = useSelector(ingredientsSelector);

  const location = useLocation();
  const isDirectLink = !location.state?.background;

  const ingredientData = items.find((item) => item._id === id) || null;

  if (!ingredientData) {
    return <div>Произошла ошибка: Ингредиент не найден</div>;
  }

  return (
    <IngredientDetailsUI
      ingredientData={ingredientData}
      isStandalone={isDirectLink}
    />
  );
};
