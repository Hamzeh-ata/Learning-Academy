import { useState, useEffect } from 'react';
import './form-modal.css';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import { useClickAway } from '@uidotdev/usehooks';
import { FeatherIcon } from '..';

// type ModalSize = 'large' | 'small' | 'side';
// type ModalType = 'info' | 'form' | 'confirmation';

const FormModal = ({
  title,
  size = 'large',
  type = 'info',
  isDismissible = true,
  showModal,
  children,
  onClose,
  titleClassName = '',
  isHeaderHidden = false,
  className = ''
}) => {
  const [modalState, setModalState] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const overlayStyle = {
    WebkitAnimation: `fade-${isMounted ? 'in' : 'out'}-fwd 0.3s ease-in both`,
    animation: `fade-${isMounted ? 'in' : 'out'}-fwd 0.3s ease-in both`
  };

  const modalStyle = {
    WebkitAnimation: `slide-${isMounted ? 'in' : 'out'}-bottom 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`,
    animation: `slide-${isMounted ? 'in' : 'out'}-bottom 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both`
  };

  const ref = useClickAway(() => {
    isDismissible && setIsMounted(false);
  });

  useEffect(() => {
    setIsMounted(showModal);
    showModal && setModalState(showModal);
  }, [showModal]);

  const handleCloseModal = () => {
    if (!isMounted) {
      setModalState(false);
      onClose && onClose(false);
    }
  };

  return ReactDOM.createPortal(
    <>
      {modalState && (
        <div
          className={classNames(`sb-modal`, { [className]: className })}
          role="dialog"
          tabIndex={-1}
          aria-labelledby="modal"
          aria-hidden="true"
        >
          <div className="sb-modal__mask" style={overlayStyle} onClick={handleCloseModal}></div>
          <div className={`modal-dialog sb-modal--${size} sb-modal--${type}`} ref={ref}>
            <div className="modal-content" style={modalStyle} onAnimationEnd={handleCloseModal}>
              {!isHeaderHidden && (
                <div className={`sb-modal__header--${type}`}>
                  {title !== null && <p className={`sb-modal__title ${titleClassName}`}>{title}</p>}
                  <button className="sb-modal__close-icon" onClick={() => setIsMounted(false)}>
                    <FeatherIcon name="X" size={24} />
                  </button>
                </div>
              )}
              <div className="modal-body">{children}</div>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
};

export default FormModal;
