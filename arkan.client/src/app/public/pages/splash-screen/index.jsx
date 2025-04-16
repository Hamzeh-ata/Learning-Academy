import { motion } from 'framer-motion';
import './splash-screen.css';
import logo from '@assets/icons/arkan-logo.png';

const letters = [' ', 'A', 'r', 'k', 'a', 'n', '.'];

const SplashScreen = () => {
  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        when: 'beforeChildren'
      }
    }
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
        delay: 0.9
      }
    }
  };

  const borderVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100%',
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  };

  const logoVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.7,
        ease: 'easeInOut'
      }
    }
  };

  const bgVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 1,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div className="splash-bg" variants={bgVariants} initial="hidden" animate="visible">
      <div className="splash-screen">
        <motion.div className="splash-logo-element" variants={logoVariants}>
          <img src={logo} alt="Logo" className="h-40 w-40" />
        </motion.div>
        <motion.div className="splash-logo" variants={containerVariants} initial="hidden" animate="visible">
          {letters.slice(0, -1).map((letter, index) => (
            <motion.span key={index} className="splash-letter animate-fade-up">
              {letter}
            </motion.span>
          ))}
          <motion.span key="dot" className="splash-letter" variants={dotVariants}>
            {letters[letters.length - 1]}
          </motion.span>
          <motion.div className="splash-border" variants={borderVariants} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
