import classNames from 'classnames';
import { Badge } from 'primereact/badge';
import { useEffect, useRef } from 'react';
import { FeatherIcon } from '@shared/components/feather-icon';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectNotifications } from '@/slices/shared/notifications.slice';
import { deleteNotificationsThunks, notificationsThunks } from '@/services/shared/notifications.service';
import { NOTIFICATION_TYPE } from '@/constants';
import { OverlayPanel } from 'primereact/overlaypanel';
import { getDateAgo } from '@utils/date-format';

export const UserNotifications = () => {
  const menuRight = useRef(null);
  const dispatch = useDispatch();
  const notificationObject = useSelector(selectNotifications);

  const handleNavLinkClick = (event, itemId) => {
    if (menuRight.current) {
      menuRight.current.hide(event);
    }
    if (itemId) {
      dispatch(deleteNotificationsThunks.delete([itemId]));
    }
  };

  useEffect(() => {
    dispatch(notificationsThunks.get());
  }, []);

  const getNotificationPath = (notification) => {
    if (notification.type === NOTIFICATION_TYPE.Course) {
      return `/course/${notification.itemId}`;
    } else if (notification.type === NOTIFICATION_TYPE.Package) {
      return `/packages?packageId=${notification.itemId}`;
    }

    return '';
  };

  return (
    <div className="user-notifications">
      <OverlayPanel ref={menuRight} className="user-notifications">
        {notificationObject.notifications?.map((notification, index) => (
          <div
            key={index}
            className="w-full p-2 py-2 px-3 hover:bg-gray-200 border-b border-slate-300 last:border-none"
          >
            <NavLink
              className={classNames('w-full flex items-start p-2 gap-4 ')}
              to={getNotificationPath(notification)}
              onClick={(event) => {
                handleNavLinkClick(event, notification.id);
                if (!getNotificationPath(notification)) {
                  event.preventDefault();
                }
              }}
            >
              <div className="flex items-center p-menuitemLink gap-1">
                <span>{NOTIFICATION_ICON[notification.type] || <FeatherIcon name="Bell" size={25} />}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-slate-400 text-md">
                  {NOTIFICATION_TITLE[notification.type] || notification.type}
                </span>
                <span className="text-base font-semibold max-w-[300px] break-words">{notification.message}</span>
                <span className="text-slate-500 text-md">{getDateAgo(new Date(notification.date))}</span>
              </div>
            </NavLink>
          </div>
        ))}
      </OverlayPanel>
      <div
        className={classNames('w-full flex items-center p-2 pl-4 cursor-pointer relative')}
        aria-haspopup
        onClick={(event) => {
          if (!notificationObject.notifications?.length) {
            event.preventDefault();
            return;
          }
          menuRight.current.toggle(event);
        }}
      >
        <FeatherIcon name="Bell" size={25} className=" relative transition-all duration-500" />
        {!!notificationObject.notifications?.length && (
          <Badge
            className="absolute bg-teal-500 w-3 h-6 self-center left-8 -top-2 font-normal !text-md flex justify-center"
            value={notificationObject.notifications?.length}
          />
        )}
      </div>
    </div>
  );
};

const NOTIFICATION_ICON = {
  [NOTIFICATION_TYPE.Announcements]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-speakerphone"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#00abfb"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 8a3 3 0 0 1 0 6" />
      <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5" />
      <path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8" />
    </svg>
  ),
  [NOTIFICATION_TYPE.Course]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-speakerphone"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#ff9300"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
      <path d="M13 8l2 0" />
      <path d="M13 12l2 0" />
    </svg>
  ),
  [NOTIFICATION_TYPE.Package]: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-speakerphone"
      width="30"
      height="30"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="#009988"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M5 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
      <path d="M9 4m0 1a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />
      <path d="M5 8h4" />
      <path d="M9 16h4" />
      <path d="M13.803 4.56l2.184 -.53c.562 -.135 1.133 .19 1.282 .732l3.695 13.418a1.02 1.02 0 0 1 -.634 1.219l-.133 .041l-2.184 .53c-.562 .135 -1.133 -.19 -1.282 -.732l-3.695 -13.418a1.02 1.02 0 0 1 .634 -1.219l.133 -.041z" />
      <path d="M14 9l4 -1" />
      <path d="M16 16l3.923 -.98" />
    </svg>
  )
};

const NOTIFICATION_TITLE = {
  [NOTIFICATION_TYPE.Announcements]: 'New Announcement',
  [NOTIFICATION_TYPE.Course]: 'Course Update',
  [NOTIFICATION_TYPE.Package]: 'Package Update'
};
