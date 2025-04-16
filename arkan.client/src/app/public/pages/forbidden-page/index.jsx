import { useEffect, useRef } from 'react';
import './forbidden-page.css';

export const ForbiddenPage = () => {
  const eyefRef = useRef(null);
  const rootRef = useRef(document.documentElement);

  useEffect(() => {
    const updateEyePosition = (x, y) => {
      const cx = 115 + 30 * x;
      const cy = 50 + 30 * y;
      if (eyefRef.current) {
        eyefRef.current.setAttribute('cx', cx.toString());
        eyefRef.current.setAttribute('cy', cy.toString());
      }
    };

    // Throttled versions of the event handlers
    const mouseMoveHandler = throttle((evt) => {
      const x = evt.clientX / window.innerWidth;
      const y = evt.clientY / window.innerHeight;
      rootRef.current.style.setProperty('--mouse-x', x);
      rootRef.current.style.setProperty('--mouse-y', y);
      updateEyePosition(x, y);
    }, 10); // Throttle limit set to 10 milliseconds

    const touchMoveHandler = throttle((touchHandler) => {
      const x = touchHandler.touches[0].clientX / window.innerWidth;
      const y = touchHandler.touches[0].clientY / window.innerHeight;
      rootRef.current.style.setProperty('--mouse-x', x);
      rootRef.current.style.setProperty('--mouse-y', y);
      updateEyePosition(x, y);
    }, 10); // Throttle limit set to 10 milliseconds

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('touchmove', touchMoveHandler);

    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('touchmove', touchMoveHandler);
    };
  }, []);

  return (
    <div className="forbidden-page flex flex-col items-center">
      <svg id="robot-error" viewBox="0 0 260 118.9">
        <defs>
          <clipPath id="white-clip">
            <circle id="white-eye" fill="#cacaca" cx="130" cy="65" r="20" />
          </clipPath>
          <text id="text-s" className="error-text" y="106">
            403
          </text>
        </defs>
        <path className="alarm" fill="#e62326" d="M120.9 19.6V9.1c0-5 4.1-9.1 9.1-9.1h0c5 0 9.1 4.1 9.1 9.1v10.6" />
        <use xlinkHref="#text-s" x="-0.5px" y="-1px" fill="black"></use>
        <use xlinkHref="#text-s" fill="#2b2b2b"></use>
        <g id="robot">
          <g id="eye-wrap">
            <use xlinkHref="#white-eye"></use>
            <circle
              ref={eyefRef}
              id="eyef"
              className="eye"
              clipPath="url(#white-clip)"
              fill="#000"
              stroke="#2aa7cc"
              strokeWidth="2"
              strokeMiterlimit="10"
              cx="130"
              cy="65"
              r="11"
            />
            <ellipse id="white-eye" fill="#2b2b2b" cx="130" cy="40" rx="18" ry="12" />
          </g>
          <circle className="lightblue" cx="105" cy="32" r="2.5" id="tornillo" />
          <use xlinkHref="#tornillo" x="50"></use>
          <use xlinkHref="#tornillo" x="50" y="60"></use>
          <use xlinkHref="#tornillo" y="60"></use>
        </g>
      </svg>
      <h2>Forbidden 403</h2>
      <h3>We are sorry, but you do not have access to this page or resource.</h3>
    </div>
  );
};

const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
