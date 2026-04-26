import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieSongs } from '../api/tmdb';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Calendar, ArrowLeft, Download, Music, Video, Award, DollarSign } from 'lucide-react';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeServer, setActiveServer] = useState(1);

  const servers = [
    { id: 1, name: 'Server 1', url: 'https://vidsrc.xyz/embed/movie/' },
    { id: 2, name: 'Server 2', url: 'https://vidsrc.in/embed/movie/' },
    { id: 3, name: 'Server 3', url: 'https://player.autoembed.cc/embed/movie/' }
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        
        // Fetch songs
        const songsData = await getMovieSongs(data.Title);
        setSongs(songsData);
      } catch (err) {
        setError(err.message || 'Failed to load details');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="loader-container" style={{ height: '70vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ textAlign: 'center', color: '#ff4b4b', padding: '5rem', background: 'rgba(255,75,75,0.1)', borderRadius: '12px', marginTop: '2rem' }}>
        <h2>Oops!</h2>
        <p>{error || 'Movie not found'}</p>
        <button onClick={() => navigate(-1)} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: 'white', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " trailer")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}
    >
      <button 
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'transparent',
          border: 'none',
          color: '#a3a3a3',
          cursor: 'pointer',
          fontSize: '1rem',
          marginBottom: '2rem',
          transition: 'color 0.2s ease'
        }}
        onMouseOver={e => e.currentTarget.style.color = 'white'}
        onMouseOut={e => e.currentTarget.style.color = '#a3a3a3'}
      >
        <ArrowLeft size={20} /> Back to Search
      </button>

      {/* Hero Section */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '3rem',
        '@media (min-width: 900px)': { flexDirection: 'row' }
      }}>
        {/* Left Col - Poster */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            flex: '0 0 350px',
            maxWidth: '400px',
            margin: '0 auto',
            width: '100%'
          }}
        >
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.1)',
            position: 'relative'
          }}>
            <img 
              src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600?text=No+Poster'} 
              alt={movie.Title}
              style={{ width: '100%', display: 'block', objectFit: 'cover' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexDirection: 'column' }}>
            <a 
              href={trailerUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none',
                padding: '1rem', borderRadius: '12px', fontWeight: 600, transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <Video size={20} /> Watch Trailer
            </a>
            <a 
              href={`https://dl.vidsrc.vip/movie/${movie.imdbID}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'rgba(255,255,255,0.1)', color: 'white', textDecoration: 'none',
                padding: '1rem', borderRadius: '12px', fontWeight: 600, transition: 'all 0.3s ease'
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
              onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            >
              <Download size={20} /> Download Source
            </a>
          </div>
        </motion.div>

        {/* Right Col - Details */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          <div>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '0.5rem' }}>
              {movie.Title}
            </h1>
            <p style={{ color: '#a3a3a3', fontSize: '1.2rem', fontStyle: 'italic' }}>
              {movie.Genre}
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center' }}>
            {movie.imdbRating !== 'N/A' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ffd700', fontSize: '1.2rem', fontWeight: 600 }}>
                <Star fill="#ffd700" size={24} />
                {movie.imdbRating} <span style={{ color: '#a3a3a3', fontSize: '1rem', fontWeight: 400 }}>/ 10</span>
              </div>
            )}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e0e0e0' }}>
              <Clock size={20} color="#a3a3a3" /> {movie.Runtime}
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e0e0e0' }}>
              <Calendar size={20} color="#a3a3a3" /> {movie.Released}
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }}></div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.9rem' }}>
              {movie.Rated}
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'white' }}>Synopsis</h3>
            <p style={{ color: '#d4d4d4', lineHeight: 1.8, fontSize: '1.1rem' }}>
              {movie.Plot}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div>
              <span style={{ color: '#a3a3a3', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Director</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{movie.Director}</span>
            </div>
            <div>
              <span style={{ color: '#a3a3a3', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Writer</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{movie.Writer}</span>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <span style={{ color: '#a3a3a3', display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem' }}>Cast</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{movie.Actors}</span>
            </div>
          </div>

          {(movie.BoxOffice !== 'N/A' || movie.Awards !== 'N/A') && (
            <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
              {movie.BoxOffice && movie.BoxOffice !== 'N/A' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80' }}>
                  <DollarSign size={20} />
                  <span style={{ fontWeight: 600 }}>{movie.BoxOffice}</span>
                </div>
              )}
              {movie.Awards && movie.Awards !== 'N/A' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffd700' }}>
                  <Award size={20} />
                  <span style={{ fontWeight: 600 }}>{movie.Awards}</span>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Streaming Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{ marginTop: '4rem' }}
      >
        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Play fill="#e50914" color="#e50914" size={28} /> Stream Now
        </h2>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {servers.map(server => (
            <button
              key={server.id}
              onClick={() => setActiveServer(server.id)}
              style={{
                background: activeServer === server.id ? '#e50914' : 'rgba(255,255,255,0.1)',
                color: 'white',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '30px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.3s ease',
              }}
            >
              {server.name}
            </button>
          ))}
        </div>

        <div style={{ 
          width: '100%', 
          aspectRatio: '16/9', 
          background: 'black', 
          borderRadius: '16px', 
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}>
          <iframe 
            src={`${servers.find(s => s.id === activeServer).url}${id}`}
            title="Video Player"
            frameBorder="0"
            allowFullScreen
            style={{ width: '100%', height: '100%' }}
          ></iframe>
        </div>
      </motion.div>

      {/* Soundtrack Section */}
      {songs.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          style={{ marginTop: '4rem' }}
        >
          <h2 style={{ fontSize: '2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Music color="#e50914" size={28} /> Soundtrack
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {songs.map((song, idx) => (
              <div key={idx} style={{ 
                background: 'rgba(255,255,255,0.05)', 
                padding: '1rem', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <img 
                  src={song.artworkUrl100 || song.artworkUrl60} 
                  alt={song.trackName} 
                  style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {song.trackName}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0.5rem 0', color: '#a3a3a3', fontSize: '0.8rem' }}>
                    {song.artistName}
                  </p>
                  {song.previewUrl && (
                    <audio controls src={song.previewUrl} style={{ width: '100%', height: '30px' }}></audio>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default MovieDetail;
