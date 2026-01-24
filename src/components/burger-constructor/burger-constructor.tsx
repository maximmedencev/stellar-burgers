import { FC, useMemo } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { BurgerConstructorUI } from '@ui';
import {
  constructorItemsSelector,
  orderRequestSelector,
  orderModalDataSelector
} from '../../services/slices/constructor-slice';

import {
  createOrder,
  closeOrderModal
} from '../../services/slices/constructor-slice';
import { useNavigate, useLocation } from 'react-router-dom';
import { userSelector } from '../../services/slices/user-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();

  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(orderRequestSelector);
  const orderModalData = useSelector(orderModalDataSelector);

  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(userSelector);

  const isAuth = !!user;

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login', {
        state: { from: location },
        replace: true
      });
      return;
    }

    if (!constructorItems.bun || orderRequest) {
      return;
    }

    const ingredientsIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientsIds));
  };

  const closeModal = () => {
    dispatch(closeOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce((sum, item) => sum + item.price, 0),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeModal}
    />
  );
};
