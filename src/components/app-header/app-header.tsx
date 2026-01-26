import { FC } from 'react';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/slices/user-slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const user = useSelector(userSelector);
  const userName = user?.name || '';

  return <AppHeaderUI userName={userName} />;
};
