import { FeatherIcon } from '../feather-icon';
import { useIsRTL } from '@hooks';
import { MOBILE_MAX_WIDTH_QUERY } from '@constants';
import classNames from 'classnames';
import { Sidebar as PrimeSideBar } from 'primereact/sidebar';
import { useRef } from 'react';
import { useMediaQuery } from '@uidotdev/usehooks';
import './sidebar-panel.css';

const setContentHeight = (contentElement, height) => {
  contentElement.style.maxHeight = `calc(100svh - ${height}px)`;
};

const isFooterAtBottom = (footerElement, parentElement) =>
  Math.ceil(footerElement.getBoundingClientRect().bottom) === parentElement.offsetHeight;

const setFooterSticky = (footerElement) => {
  footerElement.classList.add('sidebar__footer--sticky');
};

export const SidebarPanel = ({
  className,
  isVisible,
  onHide,
  position,
  isFullScreen,
  onShow,
  children,
  title,
  hint,
  footer,
  isSemiFullScreen = false,
  isDismissible
}) => {
  const isMobile = useMediaQuery(MOBILE_MAX_WIDTH_QUERY);
  const isRTL = useIsRTL();
  const sidebarRef = useRef(null);
  const classes = classNames('sidebar-container', className, {
    'sidebar-container--semi-full': !isMobile && isSemiFullScreen
  });

  const handleOnShow = () => {
    const element = sidebarRef.current?.getElement();
    if (element) {
      const headerElement = element.querySelector('.sidebar__header');
      const bodyElement = element.querySelector('.sidebar__content');
      const footerElement = element.querySelector('.sidebar__footer');
      if (footerElement) {
        const headElementHeight = headerElement.offsetHeight;
        const footerElementHeight = footerElement.offsetHeight;
        if (!isSemiFullScreen) {
          const height = Math.abs(headElementHeight + footerElementHeight) + 20;
          setContentHeight(bodyElement, height);
        }
        isFooterAtBottom(footerElement, element) && footer && setFooterSticky(footerElement);
      }
    }
    onShow && onShow();
  };

  if (isRTL) {
    position = position === 'right' ? 'left' : 'right';
  }

  const isFullScreenMode = isMobile || isFullScreen || isSemiFullScreen;
  return (
    <PrimeSideBar
      ref={sidebarRef}
      visible={isVisible}
      onHide={onHide}
      position={position}
      className={classes}
      fullScreen={isFullScreenMode}
      onShow={handleOnShow}
      showCloseIcon={false}
      blockScroll
      dismissable={isDismissible}
    >
      <div className="sidebar__header">
        {title && (
          <div className="sidebar__title">
            <h5>{title}</h5>
          </div>
        )}

        {isDismissible && <FeatherIcon name="X" size={24} onClick={onHide} className="sidebar__icon" />}
        {hint && (
          <div className="sidebar__hint">
            <h5>{hint}</h5>
          </div>
        )}
      </div>
      <div className="sidebar__content">{isVisible && children}</div>
      {!!footer && <div className="sidebar__footer">{footer}</div>}
    </PrimeSideBar>
  );
};
