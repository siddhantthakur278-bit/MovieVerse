import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Clock, Bookmark, Play } from 'lucide-react';
import { useLists } from '../context/ListsContext';

const MovieCard = ({ movie, index }) => {
  const { toggleList, isInList } = useLists();
  const [isHovered, setIsHovered] = useState(false);
  
  const shapes = ['circle', 'square', 'triangle'];
  const shape = shapes[index % 3];
  const colors = ['var(--bau-red)', 'var(--bau-blue)', 'var(--bau-yellow)'];
  const accentColor = colors[index % 3];

  const isLiked = isInList('liked', movie.imdbID);
  const isWatchLater = isInList('watchLater', movie.imdbID);
  const isBucket = isInList('bucketList', movie.imdbID);

  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-abstract-graphic-lines-background-animation-31622-large.mp4";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      style={{ display: 'flex' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bau-card" style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        position: 'relative',
        overflow: 'hidden',
        borderColor: isHovered ? 'var(--bau-black)' : accentColor,
        background: isHovered ? 'var(--bau-black)' : 'var(--bau-white)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'translateY(-5px)' : 'none',
        boxShadow: isHovered ? '6px 6px 0px var(--bau-black)' : '4px 4px 0px var(--bau-black)'
      }}>
        <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', width: '100%' }}>
          {/* Corner Decoration */}
          <motion.div 
            animate={{ 
              rotate: isHovered ? 180 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              zIndex: 20,
              width: '12px',
              height: '12px',
              backgroundColor: isHovered ? 'var(--bau-white)' : accentColor,
              border: '2px solid var(--bau-black)',
              borderRadius: shape === 'circle' ? '50%' : '0',
              clipPath: shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : 'none'
            }} 
          />

          <div style={{ position: 'relative', paddingTop: '150%', overflow: 'hidden', borderBottom: '2px solid var(--bau-black)' }}>
            {/* Background Video on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.video
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    zIndex: 1
                  }}
                >
                  <source src={videoUrl} type="video/mp4" />
                </motion.video>
              )}
            </AnimatePresence>

            <img
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movie.Title}
              className="movie-poster"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: isHovered ? 2 : 0,
                filter: isHovered ? 'contrast(1.1) brightness(0.7)' : 'none',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                transition: 'all 0.4s ease',
              }}
            />

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    background: 'var(--bau-yellow)',
                    padding: '0.6rem',
                    borderRadius: '50%',
                    border: '2px solid black',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Play size={20} fill="black" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div style={{ padding: '0.8rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem', background: isHovered ? 'var(--bau-black)' : 'var(--bau-white)', color: isHovered ? 'white' : 'black', transition: 'all 0.3s' }}>
            <h3 className="bau-heading" style={{
              fontSize: '0.95rem',
              color: 'inherit',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {movie.Title.toUpperCase()}
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ 
                background: isHovered ? 'var(--bau-white)' : accentColor, 
                color: 'black',
                padding: '1px 6px',
                fontWeight: 900,
                fontSize: '0.7rem',
                border: '1.5px solid var(--bau-black)'
              }}>
                {movie.Year}
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                <span style={{ width: '6px', height: '6px', background: 'var(--bau-red)', borderRadius: '50%' }} />
                <span style={{ width: '6px', height: '6px', background: 'var(--bau-blue)' }} />
                <span style={{ width: '6px', height: '6px', background: 'var(--bau-yellow)', clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
              </div>
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div style={{ 
          padding: '0.5rem', 
          display: 'flex', 
          gap: '0.4rem', 
          borderTop: '2px solid var(--bau-black)',
          background: isHovered ? 'var(--bau-black)' : 'var(--bau-white)'
        }}>
          <button 
            onClick={() => toggleList('liked', movie)}
            className="bau-button-sm"
            style={{ 
              background: isLiked ? 'var(--bau-red)' : 'white',
              color: isLiked ? 'white' : 'black',
              flex: 1,
              padding: '0.4rem',
              border: '1.5px solid black',
              cursor: 'pointer'
            }}
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={() => toggleList('watchLater', movie)}
            className="bau-button-sm"
            style={{ 
              background: isWatchLater ? 'var(--bau-blue)' : 'white',
              color: isWatchLater ? 'white' : 'black',
              flex: 1,
              padding: '0.4rem',
              border: '1.5px solid black',
              cursor: 'pointer'
            }}
          >
            <Clock size={14} />
          </button>
          <button 
            onClick={() => toggleList('bucketList', movie)}
            className="bau-button-sm"
            style={{ 
              background: isBucket ? 'var(--bau-yellow)' : 'white',
              color: isBucket ? 'white' : 'black',
              flex: 1,
              padding: '0.4rem',
              border: '1.5px solid black',
              cursor: 'pointer'
            }}
          >
            <Bookmark size={14} fill={isBucket ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};


export default MovieCard;



