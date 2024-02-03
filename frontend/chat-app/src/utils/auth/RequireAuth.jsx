import { Outlet, useLocation, Link } from 'react-router-dom';

export const RequireAuth = () => {
  const location = useLocation();
  const token = localStorage.getItem('User');
  const converToken = JSON.parse(token);

  return converToken?.token ? (
    <Outlet />
  ) : (
    <Link to="/login" state={{ from: location }} replace />
  );
};
