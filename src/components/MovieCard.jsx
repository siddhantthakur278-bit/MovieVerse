import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ display: 'flex' }}
    >
      <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', display: 'flex', width: '100%' }}>
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          style={{
            background: 'var(--bg-card)',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', paddingTop: '150%', overflow: 'hidden' }}>
            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.Title}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.5s ease',
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0) 100%)',
            }} />
          </div>
          
          <div style={{ padding: '1.2rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', position: 'absolute', bottom: 0, left: 0, right: 0 }}>
            <h3 style={{
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              marginBottom: '0.3rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {movie.Title}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#e50914', fontWeight: 600, fontSize: '0.9rem' }}>{movie.Year}</span>
              <span style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.7rem',
                color: '#a3a3a3',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                {movie.Type}
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
