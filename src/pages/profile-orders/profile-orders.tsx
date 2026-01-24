import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector } from '../../services/store';
import {
  userOrdersLoadingSelector,
  fetchUserOrders,
  selectUserOrders
} from '../../services/slices/user-orders-sclice';
import { useDispatch } from '../../services/store';

import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectUserOrders);
  const isUserOrdersLoading = useSelector(userOrdersLoadingSelector);
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isUserOrdersLoading && !orders.length) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
