import { FC, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

import { ingredientsSelector } from '../../services/slices/ingredients-slice';
import { orderLoadingSelector } from '../../services/slices/feed-slice';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { fetchOrderById } from '../../services/slices/feed-slice';
import { selectSelectedOrder } from '../../services/slices/feed-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const orderNumber = number ? parseInt(number, 10) : NaN;

  const isOrderLoading = useSelector(orderLoadingSelector);

  const dispatch = useDispatch();
  const orderData = useSelector(selectSelectedOrder);
  const ingredients = useSelector(ingredientsSelector);

  useEffect(() => {
    if (!isNaN(orderNumber)) {
      dispatch(fetchOrderById(orderNumber));
    }
  }, [dispatch, orderNumber]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isOrderLoading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
