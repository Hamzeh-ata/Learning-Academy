import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { SidebarLogo } from './components/sidebar-logo';
import './sidebar.css';
import { logout } from '@services/auth/auth.service';
import { sidebarRoutes } from '@(admin)/utils/routes';

export const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    navigate('/home');
    await dispatch(logout());
  };

  return (
    <div className="w-[19rem] bg-gray-800 min-h-screen h-full">
      <div className="pl-2 py-8 flex flex-col h-full">
        <SidebarLogo
          classNames="cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            navigate('/admin-home');
          }}
        />
        <div className="mt-4 overflow-y-auto max-h-[calc(100vh-190px)]">
          {sidebarRoutes.map((route) => (
            <section key={route.path} className="nav-section">
              <NavLink
                to={route.path}
                onClick={() => navigate(route.path)}
                activeclassname="active"
                className="nav-section-header"
              >
                {route.icon}
                <span>{route.label}</span>
              </NavLink>
            </section>
          ))}

          <section className="nav-section">
            <a onClick={handleLogout} className="nav-section-header">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-login"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                <path d="M20 12h-13l3 -3m0 6l-3 -3" />
              </svg>
              <span>Logout</span>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
};
