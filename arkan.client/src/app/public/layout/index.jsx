import { ChatBot } from '@/app/client/pages/chat-bot';
import { SOCKET_TOPICS } from '@/constants';
import { useSubscribeToTopic } from '@/hooks/useSubscribeToTopic';
import { isFooterVisible } from '@/slices/client-slices/content-management.slice';
import { Modal } from '@shared/components/modal';
import { closeLoginModal, selectOpenLoginModal } from '@slices/auth/auth.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from '../features/footer';
import { LoginForm } from '../features/login-page';
import Navbar from '../features/navbar';

export const Layout = () => {
  const location = useLocation();
  const showFooter = useSelector(isFooterVisible);
  const isChatBotHidden = location.pathname.includes('messages');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useSubscribeToTopic(SOCKET_TOPICS.CLIENT);

  const showLoginPopup = useSelector(selectOpenLoginModal);
  const dispatch = useDispatch();

  const handleModalClose = () => {
    dispatch(closeLoginModal());
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="grow animate-fade-down">
        <Outlet />
      </div>
      <Modal isOpen={showLoginPopup} onClose={handleModalClose}>
        <LoginForm onLoggedIn={handleModalClose} />
      </Modal>
      {!isChatBotHidden && <ChatBot />}
      {showFooter && <Footer />}
    </div>
  );
};
