import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Circle, Square, Triangle, Heart, Clock, Bookmark, Eye, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLists } from '../context/ListsContext';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showVision, setShowVision] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { vision, setVision } = useLists();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navLinks = [
    { path: '/', label: 'HOME', color: 'var(--bau-red)', icon: Square },
    { path: '/lists', label: 'COLLECTIONS', color: 'var(--bau-blue)', icon: Circle },
  ];

  const visionModes = [
    { id: 'modernist', label: 'MODERNIST', color: 'var(--bau-yellow)' },
    { id: 'noir', label: '1920_NOIR', color: 'var(--bau-black)' },
    { id: 'technicolor', label: 'TECHNICOLOR', color: 'var(--bau-red)' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '1rem 5%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '2rem',
        background: 'var(--bau-white)',
        borderBottom: 'var(--bau-border-width) solid var(--bau-black)',
        boxShadow: isScrolled ? 'var(--bau-shadow-sm)' : 'none',
        flexWrap: 'wrap'
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem' }} onClick={clearSearch}>
        {/* Bauhaus Geometric Logo */}
        <div style={{ display: 'flex', gap: '4px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            style={{ width: '24px', height: '24px', background: 'var(--bau-red)', borderRadius: '50%', border: '2px solid var(--bau-black)' }}
          />
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ width: '24px', height: '24px', background: 'var(--bau-yellow)', border: '2px solid var(--bau-black)' }}
          />
          <motion.div
             animate={{ scale: [1, 1.1, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             style={{ 
              width: '24px', 
              height: '24px', 
              background: 'var(--bau-blue)', 
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              border: '2px solid var(--bau-black)'
            }} 
          />
        </div>
        <span className="bau-heading" style={{ fontSize: '1.75rem', color: 'var(--bau-black)', letterSpacing: '-1px' }}>
          MOVIE<span style={{ color: 'var(--bau-red)' }}>VERSE</span>
        </span>
      </Link>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Navigation Links */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                fontWeight: 900,
                fontSize: '0.85rem',
                padding: '0.6rem 1.2rem',
                border: '2px solid var(--bau-black)',
                background: location.pathname === link.path ? link.color : 'white',
                color: location.pathname === link.path ? (link.color === 'var(--bau-yellow)' ? 'black' : 'white') : 'black',
                boxShadow: location.pathname === link.path ? 'none' : '4px 4px 0px black',
                transform: location.pathname === link.path ? 'translate(2px, 2px)' : 'none',
                transition: 'all 0.1s ease'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Vision Switcher */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowVision(!showVision)}
            className="bau-button"
            style={{ 
              padding: '0.6rem', 
              background: 'white', 
              boxShadow: '4px 4px 0px black',
              transform: showVision ? 'translate(2px, 2px)' : 'none'
            }}
            title="CINEMATIC_VISION"
          >
            <Eye size={20} />
          </button>
          
          <AnimatePresence>
            {showVision && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  background: 'var(--bau-white)',
                  border: '2px solid black',
                  boxShadow: '8px 8px 0px black',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  width: '200px',
                  zIndex: 1000
                }}
              >
                {visionModes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setVision(mode.id);
                      setShowVision(false);
                    }}
                    style={{
                      padding: '0.6rem',
                      textAlign: 'left',
                      background: vision === mode.id ? mode.color : 'white',
                      color: vision === mode.id ? (mode.id === 'noir' || mode.id === 'technicolor' ? 'white' : 'black') : 'black',
                      fontWeight: 900,
                      border: '2px solid black',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    {mode.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <form onSubmit={handleSearch} style={{ position: 'relative', width: '250px' }}>
          <input
            type="text"
            placeholder="SEARCH_CONTENT..."
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              if (e.target.value === '') {
                setSearchQuery('');
              }
            }}
            className="bau-border-sm"
            style={{
              width: '100%',
              padding: '0.6rem 1rem',
              paddingLeft: '2.5rem',
              background: 'var(--bau-white)',
              color: 'var(--bau-black)',
              outline: 'none',
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              boxShadow: '4px 4px 0px black',
            }}
          />
          <Search
            size={16}
            color="var(--bau-black)"
            style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)' }}
          />
        </form>
      </div>
    </motion.nav>
  );
};

export default Navbar;


