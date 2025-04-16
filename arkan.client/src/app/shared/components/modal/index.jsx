import { createPortal } from 'react-dom';

export const Modal = ({ isOpen, onClose, children }) =>
  createPortal(
    <div
      onClick={onClose}
      className={`fixed inset-0 flex items-center justify-center ${isOpen ? 'visible bg-black bg-opacity-50' : 'invisible'}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`arkan-modal rounded-lg shadow p-8 transition-all w-2/5 ${isOpen ? 'animate-jump-in' : 'hidden'}`}
      >
        <button
          className="absolute cursor-pointer top-auto right-6 px-1 rounded-lg bg-transparent text-blue-grey-400 hover:text-blue-gray-600 text-base font-bold"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            width="24"
            height="24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {isOpen && children}
      </div>
    </div>,
    document.body
  );
