import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiChevronDown, FiUser, FiHeart, FiLogOut, FiSettings, FiGrid, FiMap, FiGlobe, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, isAuthenticated, isStudent, isOwner, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { language, changeLanguage } = useLanguage();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef(null);
  const langNames = { en: 'English', si: 'සිංහල', ta: 'தமිழ්' };
  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target)) setLangDropdownOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => { e.preventDefault(); if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery)}`); setSearchQuery(''); setMobileMenuOpen(false); } };
  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); setMobileMenuOpen(false); };

  return (
    <nav className="navbar">
      <div className="navbar-inner" style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Link to="/" className="navbar-logo">🎓 UniBoard</Link>
        
        {/* Desktop Search Bar */}
        <form onSubmit={handleSearch} className="navbar-search-form" style={{ flex: 1, maxWidth: 400, margin: '0 2rem' }}>
          <div className="search-bar">
            <FiSearch style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            <input type="text" placeholder={t('home.searchPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </form>
        
        {/* Desktop Navigation */}
        <div className="navbar-links navbar-links-desktop">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>{t('nav.home')}</Link>
          <Link to="/search" className={`nav-link ${isActive('/search') ? 'active' : ''}`}>{t('nav.listings')}</Link>
          <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`}><FiMap size={15} /> {t('nav.map')}</Link>

          {/* Language Switcher */}
          <div className="relative" ref={langDropdownRef}>
            <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
              <FiGlobe size={15} /> <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{langNames[language]}</span> <FiChevronDown size={12} />
            </button>
            <AnimatePresence>
              {langDropdownOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="dropdown-menu absolute" style={{ top: 'calc(100% + 8px)', right: 0, minWidth: 120 }}>
                  {['en', 'si', 'ta'].map(l => (
                    <div key={l} className="dropdown-item" onClick={() => { changeLanguage(l); setLangDropdownOpen(false); }} style={{ fontWeight: language === l ? 600 : 400 }}>
                      {langNames[l]}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <>
              {isStudent && <Link to="/favorites" className={`nav-link ${isActive('/favorites') ? 'active' : ''}`}><FiHeart size={15} /> {t('nav.saved')}</Link>}
              {isOwner && <Link to="/owner/dashboard" className={`nav-link ${isActive('/owner/dashboard') ? 'active' : ''}`}>{t('nav.dashboard')}</Link>}
              {isAdmin && <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>{t('nav.admin')}</Link>}
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2" style={{ background: '#F1F5F9', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '6px 14px 6px 6px', cursor: 'pointer' }}>
                  {user?.avatar || user?.profilePicture ? (
                    <img src={user.avatar || user.profilePicture} alt={user.name} className="avatar avatar-sm" />
                  ) : (
                    <div className="avatar avatar-sm flex items-center justify-center" style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user?.name?.charAt(0)?.toUpperCase()}</div>
                  )}
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name?.split(' ')[0]}</span>
                  <FiChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="dropdown-menu absolute" style={{ top: 'calc(100% + 8px)', right: 0 }}>
                      <div style={{ padding: 'var(--space-3) var(--space-4)', borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-2)' }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user?.name}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
                      </div>
                      {isStudent && <div className="dropdown-item" onClick={() => { navigate('/profile'); setDropdownOpen(false); }}><FiUser size={15} /> {t('nav.profile')}</div>}
                      {isOwner && <div className="dropdown-item" onClick={() => { navigate('/owner/dashboard'); setDropdownOpen(false); }}><FiGrid size={15} /> {t('nav.myListings')}</div>}
                      {isAdmin && <div className="dropdown-item" onClick={() => { navigate('/admin'); setDropdownOpen(false); }}><FiSettings size={15} /> {t('nav.adminPanel')}</div>}
                      <div style={{ height: 1, background: 'var(--border)', margin: 'var(--space-2) 0' }} />
                      <div className="dropdown-item danger" onClick={handleLogout}><FiLogOut size={15} /> {t('nav.signOut')}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">{t('nav.signIn')}</Link>
              <Link to="/register" className="btn btn-primary btn-sm">{t('nav.getStarted')}</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mobile-menu-btn"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="mobile-menu"
          >
            <form onSubmit={handleSearch} style={{ padding: 'var(--space-3)' }}>
              <div className="search-bar" style={{ marginBottom: 'var(--space-3)' }}>
                <FiSearch style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <input type="text" placeholder={t('home.searchPlaceholder')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              </div>
            </form>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-3)' }}>
              <Link to="/" className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</Link>
              <Link to="/search" className={`mobile-nav-link ${isActive('/search') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>{t('nav.listings')}</Link>
              <Link to="/map" className={`mobile-nav-link ${isActive('/map') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}><FiMap size={15} /> {t('nav.map')}</Link>
              
              {isAuthenticated ? (
                <>
                  {isStudent && <Link to="/favorites" className={`mobile-nav-link ${isActive('/favorites') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}><FiHeart size={15} /> {t('nav.saved')}</Link>}
                  {isOwner && <Link to="/owner/dashboard" className={`mobile-nav-link ${isActive('/owner/dashboard') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>{t('nav.dashboard')}</Link>}
                  {isAdmin && <Link to="/admin" className={`mobile-nav-link ${isActive('/admin') ? 'active' : ''}`} onClick={() => setMobileMenuOpen(false)}>{t('nav.admin')}</Link>}
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)' }}>
                    <button className="mobile-nav-link" onClick={() => { changeLanguage(language === 'en' ? 'si' : language === 'si' ? 'ta' : 'en'); setMobileMenuOpen(false); }} style={{ width: '100%' }}>
                      <FiGlobe size={15} /> {langNames[language]}
                    </button>
                    <button className="mobile-nav-link danger" onClick={handleLogout} style={{ width: '100%' }}><FiLogOut size={15} /> {t('nav.signOut')}</button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.signIn')}</Link>
                  <Link to="/register" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>{t('nav.getStarted')}</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
