import { NavLink } from 'react-router-dom';
import { ProfileList } from './profile-llist';
import { UserNotifications } from './user-notifications';

export const AuthButtons = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return (
      <div className="flex gap-2 items-center">
        <UserNotifications />
        <ProfileList />
      </div>
    );
  }

  return (
    <div className="xl:me-10 flex gap-4 flex-wrap">
      <NavLink to="/login" className="hover:transition-all hover:scale-105 border px-6 py-1 rounded">
        Log In
      </NavLink>
      <NavLink
        to="/register"
        className="hover:transition-all hover:scale-105 font-semibold border px-4 py-1 rounded bg-white text-black"
      >
        Register
      </NavLink>
    </div>
  );
};
