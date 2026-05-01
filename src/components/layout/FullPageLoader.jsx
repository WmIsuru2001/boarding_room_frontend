import { motion, AnimatePresence } from 'framer-motion';
import './FullPageLoader.css';

/**
 * Full-Page Loading Screen Component
 * Displays during time-consuming operations (uploads, submissions, etc.)
 * 
 * @param {boolean} isVisible - Whether to show the loader
 * @param {string} message - Optional loading message
 * @param {number} progress - Optional progress percentage (0-100)
 * @param {boolean} blur - Whether to blur background (default: true)
 */
export default function FullPageLoader({ 
  isVisible = false, 
  message = 'Processing...', 
  progress = null,
  blur = true 
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="full-page-loader-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{ backdropFilter: blur ? 'blur(4px)' : 'none' }}
        >
          <motion.div
            className="full-page-loader-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
          >
            {/* Animated spinner */}
            <div className="loader-spinner">
              <svg viewBox="0 0 50 50" className="spinner-svg">
                <circle
                  className="spinner-circle"
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  strokeWidth="3"
                />
              </svg>
            </div>

            {/* Loading message */}
            <motion.p
              className="loader-message"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {message}
            </motion.p>

            {/* Progress bar (optional) */}
            {progress !== null && (
              <div className="loader-progress-container">
                <div className="loader-progress-bar">
                  <motion.div
                    className="loader-progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="loader-progress-text">{Math.round(progress)}%</p>
              </div>
            )}

            {/* Animated dots */}
            <div className="loader-dots">
              {[0, 1, 2].map(i => (
                <motion.span
                  key={i}
                  className="loader-dot"
                  initial={{ y: 0, opacity: 0.5 }}
                  animate={{ y: [-8, 0, -8], opacity: [0.5, 1, 0.5] }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
