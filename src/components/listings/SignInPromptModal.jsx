import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiLogIn, FiUserPlus, FiLock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

export default function SignInPromptModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/register');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal — static shell handles centering, inner motion.div handles animation */}
          <div className="modal-positioner">
            <motion.div
              className="modal-panel"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="signin-prompt-title"
            >
            {/* Close button */}
            <button className="modal-close-btn" onClick={onClose} aria-label="Close">
              <FiX size={18} />
            </button>

            {/* Icon */}
            <div className="modal-icon-wrap">
              <div className="modal-icon">
                <FiLock size={28} />
              </div>
            </div>

            {/* Content */}
            <h2 id="signin-prompt-title" className="modal-title">
              Sign In to View Details
            </h2>
            <p className="modal-subtitle">
              Room details are available exclusively to registered students and room owners.
              Please sign in or create an account to continue.
            </p>

            {/* Actions */}
            <div className="modal-actions">
              <button
                id="signin-prompt-login-btn"
                className="btn btn-primary btn-lg w-full"
                onClick={handleLogin}
              >
                <FiLogIn size={18} />
                Sign In
              </button>
              <button
                id="signin-prompt-register-btn"
                className="btn btn-outline btn-lg w-full"
                onClick={handleRegister}
              >
                <FiUserPlus size={18} />
                Create an Account
              </button>
            </div>

            <p className="modal-footer-note">
              Already browsing as a guest?{' '}
              <span className="modal-dismiss-link" onClick={onClose}>
                Continue browsing
              </span>
            </p>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
