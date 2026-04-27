import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🎓 UniBoard</div>
            <p className="footer-desc">{t('footer.aboutDesc')}</p>
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><FiMapPin size={14} /> Eastern University, Trincomalee</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><FiMail size={14} /> support@uniboard.lk</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><FiPhone size={14} /> +94 26 222 0000</span>
            </div>
          </div>
          <div>
            <h4>{t('footer.quickLinks')}</h4>
            <Link to="/">{t('nav.home')}</Link>
            <Link to="/search">{t('nav.listings')}</Link>
            <Link to="/map">{t('nav.map')}</Link>
            <Link to="/register">{t('nav.getStarted')}</Link>
          </div>
          <div>
            <h4>{t('footer.support')}</h4>
            <a href="#">{t('footer.helpCenter')}</a>
            <a href="#">{t('footer.contactUs')}</a>
            <a href="#">FAQ</a>
          </div>
          <div>
            <h4>{t('footer.legal')}</h4>
            <a href="#">{t('footer.terms')}</a>
            <a href="#">{t('footer.privacy')}</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} UniBoard - Eastern University, Trincomalee. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
