import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/slices/user-slice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useSelector(userSelector);
  const userName = user?.name || '';

  let activeSection: 'constructor' | 'feed' | 'profile' | undefined;

  if (pathname === '/' || pathname.startsWith('/ingredients/')) {
    activeSection = 'constructor';
  } else if (pathname === '/feed' || pathname.startsWith('/feed/')) {
    activeSection = 'feed';
  } else if (pathname.startsWith('/profile')) {
    activeSection = 'profile';
  }

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <AppHeaderUI
      userName={userName}
      activeSection={activeSection}
      onNavigate={handleNavigate}
    />
  );
};
