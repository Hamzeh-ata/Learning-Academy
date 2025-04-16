import { useIsAuthenticated, useIsStudent } from '@hooks';
import { getUserProfile } from '@services/client-services/user-profile.service';
import { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { AuthButtons } from './components/auth-buttons';
import { MenuButton } from './components/menu-button';
import './navbar.css';
import { selectUserCart } from '@slices/client-slices/user-cart.slice';
import { getUserCart } from '@services/client-services/user-cart.service';
import { Badge } from 'primereact/badge';
import { FeatherIcon } from '@shared/components/feather-icon';
import logo from '@assets/icons/arkan-logo.png';

const navItems = [
  {
    label: 'Home',
    path: '/home'
  },
  {
    label: 'Courses',
    path: '/course'
  },
  {
    label: 'Live Stream',
    path: '/live-stream'
  },
  {
    label: 'Instructors',
    path: '/instructor'
  },
  {
    label: 'Packages',
    path: '/packages'
  },
  {
    label: 'Categories',
    path: '/categories'
  },
  {
    label: 'About Us',
    path: '/about-us'
  }
];

const Navbar = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const dispatch = useDispatch();
  const isStudent = useIsStudent();
  const cartItems = useSelector(selectUserCart);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mainNavItems, setMainNavItems] = useState(navItems);

  useEffect(() => {
    if (isStudent) {
      dispatch(getUserCart());
    }
  }, [dispatch, isStudent]);

  useEffect(() => {
    const cartItem = { label: 'Cart', path: '/checkout', id: 1 };
    const cartExists = mainNavItems.some((item) => item.label === cartItem.label);

    if (isAuthenticated) {
      dispatch(getUserProfile());

      if (isStudent && !cartExists) {
        setMainNavItems((prevItems) => [...prevItems, cartItem]);
      }
    } else if (!isAuthenticated && cartExists) {
      setMainNavItems((prevItems) => prevItems.filter((item) => item.label !== cartItem.label));
    }
  }, [isAuthenticated]);

  function renderNavLink(route, cartItems) {
    return (
      <NavLink key={route.path} to={route.path} className="nav-item" activeclassname="active">
        {route.id ? (
          <span className="relative flex gap-1 w-fit items-center">
            {route.label} <FeatherIcon name="ShoppingCart" size="18" />
            {cartItems.items.length > 0 && (
              <Badge
                value={cartItems.items.length}
                className="bg-arkan bg-opacity-90 absolute -top-4 -right-4 font-normal !text-md"
              />
            )}
          </span>
        ) : (
          route.label
        )}
      </NavLink>
    );
  }

  return (
    <nav className="bg-slate-900 text-white p-2 xl:py-0 flex items-center navbar flex-wrap">
      <div className="flex xl:justify-around items-center navbar flex-1">
        <div className="flex items-center justify-center xl:justify-between w-1/2 relative flex-1">
          <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)} />

          <div className="ms-10">
            <img src={logo} alt="logo" className="h-20 w-20" />
          </div>

          <div className="space-x-8 py-2 hidden items-center justify-center xl:flex flex-1">
            {mainNavItems.map((route) => renderNavLink(route, cartItems))}
          </div>
        </div>

        <div className="flex items-center space-x-4 justify-end">
          <AuthButtons isAuthenticated={isAuthenticated} />
        </div>
      </div>

      {isMenuOpen && (
        <div className="space-y-4 py-2 flex justify-center xl:hidden flex-col w-full mt-4">
          {mainNavItems.map((route) => renderNavLink(route, cartItems))}
        </div>
      )}
    </nav>
  );
});

Navbar.displayName = 'Navbar';
export default Navbar;
