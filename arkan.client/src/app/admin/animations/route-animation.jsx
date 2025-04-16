import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';

const WithRouteAnimation = ({ children }) => {
  const location = useLocation();
  return (
    <div className="transition-effect">
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.div
          key={location.pathname + Date.now()}
          initial={{ width: '10%' }}
          animate={{ width: '100%' }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WithRouteAnimation;
