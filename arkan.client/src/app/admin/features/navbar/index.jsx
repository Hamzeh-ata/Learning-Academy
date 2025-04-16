import { useSelector } from 'react-redux';
import { NavbarUserInfo } from './components/navbar-user-info';
import { NavbarSearch } from './components/navbar-search';

export const AdminNavbar = () => {
  const { userInfo } = useSelector((state) => state.auth);

  // sidebarRoutes
  return (
    <div className="flex justify-between items-center">
      <NavbarSearch />
      <div className="flex">
        <NavbarUserInfo userInfo={userInfo} />
      </div>
    </div>
  );
};
