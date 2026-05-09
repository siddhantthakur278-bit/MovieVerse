import React, { useState } from 'react';
import { useLists } from '../context/ListsContext';
import MovieCard from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Clock, Bookmark, Trash2 } from 'lucide-react';

const MyLists = () => {
  const { watchLater, liked, bucketList } = useLists();
  const [activeTab, setActiveTab] = useState('liked');

  const tabs = [
    { id: 'liked', label: 'LIKED', icon: Heart, color: 'var(--bau-red)', data: liked },
    { id: 'watchLater', label: 'WATCH LATER', icon: Clock, color: 'var(--bau-blue)', data: watchLater },
    { id: 'bucketList', label: 'BUCKET LIST', icon: Bookmark, color: 'var(--bau-yellow)', data: bucketList },
  ];

  const activeData = tabs.find(t => t.id === activeTab).data;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}>
      <header style={{ 
        background: 'var(--bau-black)', 
        color: 'white', 
        padding: '3rem', 
        marginBottom: '4rem',
        border: 'var(--bau-border-width) solid var(--bau-black)',
        boxShadow: 'var(--bau-shadow-lg)'
      }}>
        <h1 className="bau-display">MY_COLLECTIONS</h1>
        <p style={{ color: 'var(--bau-yellow)', fontWeight: 700, letterSpacing: '2px', marginTop: '1rem' }}>
          YOUR_PERSONAL_CINEMATIC_ARCHIVE
        </p>
      </header>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '3rem', 
        flexWrap: 'wrap' 
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="bau-button"
            style={{
              background: activeTab === tab.id ? tab.color : 'var(--bau-white)',
              color: activeTab === tab.id ? (tab.id === 'bucketList' ? 'black' : 'white') : 'black',
              flex: '1',
              minWidth: '200px',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <tab.icon size={20} fill={activeTab === tab.id ? "currentColor" : "none"} />
            {tab.label} ({tab.data.length})
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeData.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '5rem', 
              border: 'var(--bau-border-width) solid var(--bau-black)',
              background: 'var(--bau-white)'
            }}>
              <h2 className="bau-heading">LIST_IS_EMPTY</h2>
              <p style={{ marginTop: '1rem' }}>START ADDING MOVIES TO YOUR {activeTab.toUpperCase()}</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '2.5rem',
            }}>
              {activeData.map((movie, idx) => (
                <MovieCard key={movie.imdbID + idx} movie={movie} index={idx} />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MyLists;
