import { useTranslation } from 'react-i18next';
import { FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function FavoritesPage() {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 'var(--space-6)' }}><FiHeart style={{ display: 'inline', color: 'var(--danger)' }} /> {t('nav.saved')}</h1>
        <div className="empty-state"><div className="empty-icon">💝</div><h3>No saved rooms yet</h3><p>Start browsing and save rooms you like to compare them later!</p></div>
      </motion.div>
    </div>
  );
}
