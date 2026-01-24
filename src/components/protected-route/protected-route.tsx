import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { userSelector } from '../../services/slices/user-slice';

type ProtectedRouteProps = {
  children: JSX.Element;
  onlyUnAuth?: boolean;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false
}: ProtectedRouteProps) => {
  const location = useLocation();

  const user = useSelector(userSelector);
  const isAuth = !!user;
  const from = location.state?.from?.pathname || '/';

  if (onlyUnAuth && isAuth) {
    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuth) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
