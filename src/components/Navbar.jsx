import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync local input with global search state if navigated away
  useEffect(() => {
    if (location.pathname !== '/') {
      setLocalQuery('');
    }
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (localQuery.trim()) {
      setSearchQuery(localQuery);
      if (location.pathname !== '/') {
        navigate('/');
      }
    } else {
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`glass`}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1rem 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.3s ease',
        background: isScrolled ? 'rgba(10, 10, 10, 0.85)' : 'rgba(20, 20, 20, 0.4)',
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }} onClick={clearSearch}>
        <motion.div
          whileHover={{ rotate: 180 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, #e50914, #ff4b4b)',
            padding: '0.5rem',
            borderRadius: '12px',
            display: 'flex',
          }}
        >
          <Film color="white" size={24} />
        </motion.div>
        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', letterSpacing: '1px' }}>
          Movie<span style={{ color: '#e50914' }}>Verse</span>
        </span>
      </Link>

      <form onSubmit={handleSearch} style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
        <input
          type="text"
          placeholder="Search movies, series..."
          value={localQuery}
          onChange={(e) => {
            setLocalQuery(e.target.value);
            if (e.target.value === '') {
              setSearchQuery('');
            }
          }}
          style={{
            width: '100%',
            padding: '0.8rem 1.2rem',
            paddingLeft: '3rem',
            paddingRight: '3rem',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)',
            color: 'white',
            outline: 'none',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
          }}
          onFocus={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.borderColor = '#e50914';
            e.target.style.boxShadow = '0 0 15px rgba(229, 9, 20, 0.3)';
          }}
          onBlur={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.05)';
            e.target.style.borderColor = 'rgba(255,255,255,0.1)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <Search
          size={18}
          color="#a3a3a3"
          style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
        />
        <AnimatePresence>
          {localQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              type="button"
              onClick={clearSearch}
              style={{
                position: 'absolute',
                right: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
              }}
            >
              <X size={18} color="#a3a3a3" />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </motion.nav>
  );
};

export default Navbar;
