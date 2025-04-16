import classNames from 'classnames';
import { Avatar } from 'primereact/avatar';
import { Menu } from 'primereact/menu';
import { useRef, useState } from 'react';
import { logout } from '@services/auth/auth.service';
import { useDispatch, useSelector } from 'react-redux';
import { FeatherIcon } from '@shared/components/feather-icon';
import { selectUserProfile } from '@slices/client-slices/user-profile.slice';
import { getImageFullPath } from '@utils/image-path';
import { NavLink } from 'react-router-dom';

export const ProfileList = () => {
  const menuRight = useRef(null);
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUserProfile);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        window.location.reload();
      });
  };

  const handleNavLinkClick = (event) => {
    if (menuRight.current) {
      menuRight.current.hide(event);
    }
  };

  const itemRenderer = (item, options) => (
    <NavLink
      className={classNames(options.className, 'w-full flex items-center p-2 pl-4')}
      to={item.path}
      onClick={handleNavLinkClick}
    >
      <div className="flex items-center p-menuitemLink">
        <span className={item.icon} />
        <span className="mx-2">{item.label}</span>
      </div>
    </NavLink>
  );

  let items = [
    {
      template: (item, options) => (
        <NavLink
          to={'/user-profile'}
          className={classNames(options.className, 'w-full flex items-center p-2 pl-4')}
          onClick={handleNavLinkClick}
        >
          <div className="flex gap-2 items-center">
            <Avatar
              image={getImageFullPath(userProfile.image)}
              className="w-10 h-10"
              shape="circle"
              pt={{
                image: {
                  width: '100%',
                  height: '100%'
                }
              }}
            />
            <div className="flex flex-col font-normal max-w-32 truncate">
              <span className="font-bold truncate">{userProfile.firstName}</span>
              <span className="text-sm truncate">{userProfile.email}</span>
            </div>
          </div>
        </NavLink>
      )
    },
    {
      separator: true
    },
    {
      label: 'Profile',
      path: '/user-profile',
      template: itemRenderer
    },

    {
      label: 'Messages',
      path: '/messages',
      messagesCount: 2,
      template: itemRenderer
    },
    {
      label: 'My Lessons',
      path: '/my-lessons',
      template: itemRenderer
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      template: (item, options) => (
        <div className={classNames(options.className, 'p-2 pl-4 text-red-500 w-full hover:text-red-600')}>
          <button onClick={(e) => options.onClick(e)} className="flex gap-2 w-full justify-between items-center">
            <span>Logout</span>

            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
          </button>
        </div>
      ),
      command: () => {
        handleLogout();
      }
    }
  ];

  return (
    <div>
      <Menu
        model={items}
        className=""
        popup
        ref={menuRight}
        onShow={() => {
          setIsOpen(true);
        }}
        onHide={() => {
          setIsOpen(false);
        }}
        id="popup_menu_right"
      />

      <div
        className={classNames('w-full flex items-center p-2 pl-4 cursor-pointer')}
        aria-controls="popup_menu_right"
        aria-haspopup
        onClick={(event) => {
          menuRight.current.toggle(event);
        }}
      >
        <Avatar image={getImageFullPath(userProfile.image)} className="mr-2" shape="circle" />
        <span className="me-2">{userProfile.firstName}</span>
        <FeatherIcon
          name="ChevronDown"
          className={classNames('transition-all duration-500', { '-rotate-180': isOpen })}
        />
      </div>
    </div>
  );
};
