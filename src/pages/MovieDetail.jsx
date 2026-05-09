import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, getMovieSongs } from '../api/tmdb';
import { motion } from 'framer-motion';
import { Play, Star, Clock, Calendar, ArrowLeft, Download, Music, Video, Award, DollarSign, RefreshCw, AlertTriangle, Heart, Bookmark } from 'lucide-react';
import { useLists } from '../context/ListsContext';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleList, isInList } = useLists();
  const [movie, setMovie] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeServer, setActiveServer] = useState(1);
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);

  const servers = [
    { id: 1, name: 'SERVER_A', movieUrl: 'https://vidsrc.me/embed/movie?imdb=', tvUrl: 'https://vidsrc.me/embed/tv?imdb=' },
    { id: 2, name: 'SERVER_B', movieUrl: 'https://vidsrc.xyz/embed/movie/', tvUrl: 'https://vidsrc.xyz/embed/tv/' },
    { id: 3, name: 'SERVER_C', movieUrl: 'https://vidsrc.pm/embed/movie/', tvUrl: 'https://vidsrc.pm/embed/tv/' },
    { id: 4, name: 'SERVER_D', movieUrl: 'https://vidsrc.in/embed/movie/', tvUrl: 'https://vidsrc.in/embed/tv/' },
    { id: 5, name: 'SERVER_E', movieUrl: 'https://player.autoembed.cc/embed/movie/', tvUrl: 'https://player.autoembed.cc/embed/tv/' }
  ];

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      window.scrollTo(0, 0);
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
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
        <div className="bau-spinner"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '5rem', 
        background: 'var(--bau-red)', 
        color: 'white',
        border: 'var(--bau-border-width) solid var(--bau-black)',
        marginTop: '2rem' 
      }}>
        <h2 className="bau-heading">ERROR 404</h2>
        <p>{error || 'CONTENT NOT FOUND'}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="bau-button bau-button-yellow"
          style={{ marginTop: '2rem' }}
        >
          RETURN TO BASE
        </button>
      </div>
    );
  }

  const isSeries = movie.Type === 'series';
  const currentServer = servers.find(s => s.id === activeServer);
  
  const isLiked = isInList('liked', movie.imdbID);
  const isWatchLater = isInList('watchLater', movie.imdbID);
  const isBucket = isInList('bucketList', movie.imdbID);

  let embedUrl = "";
  if (currentServer.id === 1) {
    embedUrl = isSeries 
      ? `${currentServer.tvUrl}${id}&sea=${season}&epi=${episode}`
      : `${currentServer.movieUrl}${id}`;
  } else {
    embedUrl = isSeries 
      ? `${currentServer.tvUrl}${id}/${season}/${episode}`
      : `${currentServer.movieUrl}${id}`;
  }

  const trailerUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + " " + movie.Year + " trailer")}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '5rem' }}
    >
      <button 
        onClick={() => navigate(-1)}
        className="bau-button bau-button-yellow"
        style={{ marginBottom: '3rem' }}
      >
        <ArrowLeft size={20} /> BACK TO COLLECTION
      </button>

      {/* Hero Section */}
      <div className="detail-grid">
        {/* Left Col - Poster */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            style={{ width: '100%', maxWidth: '450px' }}
          >
            <div className="bau-card" style={{ padding: '0', overflow: 'hidden', borderColor: 'var(--bau-blue)' }}>
              <img 
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600?text=No+Poster'} 
                alt={movie.Title}
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexDirection: 'column' }}>
              <a 
                href={trailerUrl}
                target="_blank"
                rel="noreferrer"
                className="bau-button bau-button-primary"
                style={{ justifyContent: 'center' }}
              >
                <Video size={20} /> WATCH TRAILER
              </a>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <button 
                  onClick={() => toggleList('liked', movie)}
                  className="bau-button"
                  style={{ 
                    background: isLiked ? 'var(--bau-red)' : 'white',
                    color: isLiked ? 'white' : 'black',
                    justifyContent: 'center'
                  }}
                  title="LIKE"
                >
                  <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
                </button>
                <button 
                  onClick={() => toggleList('watchLater', movie)}
                  className="bau-button"
                  style={{ 
                    background: isWatchLater ? 'var(--bau-blue)' : 'white',
                    color: isWatchLater ? 'white' : 'black',
                    justifyContent: 'center'
                  }}
                  title="WATCH LATER"
                >
                  <Clock size={20} />
                </button>
                <button 
                  onClick={() => toggleList('bucketList', movie)}
                  className="bau-button"
                  style={{ 
                    background: isBucket ? 'var(--bau-yellow)' : 'white',
                    color: isBucket ? 'white' : 'black',
                    justifyContent: 'center'
                  }}
                  title="BUCKET LIST"
                >
                  <Bookmark size={20} fill={isBucket ? "currentColor" : "none"} />
                </button>
              </div>

              <a 
                href={`https://dl.vidsrc.vip/${isSeries ? 'tv' : 'movie'}/${movie.imdbID}`}
                target="_blank"
                rel="noreferrer"
                className="bau-button bau-button-secondary"
                style={{ justifyContent: 'center' }}
              >
                <Download size={20} /> DOWNLOAD SOURCE
              </a>
            </div>
          </motion.div>

          {/* Right Col - Details */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div style={{ background: 'var(--bau-black)', color: 'white', padding: '2rem', border: 'var(--bau-border-width) solid var(--bau-black)', boxShadow: '8px 8px 0px var(--bau-blue)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <span style={{ background: 'var(--bau-red)', color: 'white', padding: '2px 10px', fontSize: '0.8rem', fontWeight: 900, border: '2px solid white' }}>
                  {movie.Type.toUpperCase()}
                </span>
              </div>
              <h1 className="bau-heading" style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
                {movie.Title.toUpperCase()}
              </h1>
              <p style={{ color: 'var(--bau-yellow)', fontSize: '1.2rem', fontWeight: 700, letterSpacing: '2px' }}>
                {movie.Genre.toUpperCase()}
              </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ background: 'var(--bau-red)', color: 'white', padding: '0.5rem 1.5rem', border: '2px solid var(--bau-black)', fontWeight: 900, boxShadow: '4px 4px 0px black' }}>
                IMDB {movie.imdbRating}
              </div>
              <div style={{ background: 'var(--bau-yellow)', color: 'black', padding: '0.5rem 1.5rem', border: '2px solid var(--bau-black)', fontWeight: 900, boxShadow: '4px 4px 0px black' }}>
                {movie.Runtime.toUpperCase()}
              </div>
              <div style={{ background: 'var(--bau-blue)', color: 'white', padding: '0.5rem 1.5rem', border: '2px solid var(--bau-black)', fontWeight: 900, boxShadow: '4px 4px 0px black' }}>
                {movie.Released.toUpperCase()}
              </div>
            </div>

            <div style={{ borderLeft: '12px solid var(--bau-red)', paddingLeft: '2rem' }}>
              <h3 className="bau-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>SYNOPSIS</h3>
              <p style={{ lineHeight: 1.6, fontSize: '1.1rem', fontWeight: 500 }}>
                {movie.Plot}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', borderTop: 'var(--bau-border-width) solid var(--bau-black)', paddingTop: '2rem' }}>
              <div>
                <span className="bau-heading" style={{ fontSize: '0.9rem', color: 'var(--bau-red)', display: 'block', marginBottom: '0.5rem' }}>DIRECTOR</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{movie.Director}</span>
              </div>
              <div>
                <span className="bau-heading" style={{ fontSize: '0.9rem', color: 'var(--bau-blue)', display: 'block', marginBottom: '0.5rem' }}>WRITER</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{movie.Writer}</span>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <span className="bau-heading" style={{ fontSize: '0.9rem', color: 'var(--bau-yellow)', display: 'block', marginBottom: '0.5rem' }}>CAST_EXPLORER</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {movie.Actors.split(',').map((actor, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        // Navigate home and search for actor
                        navigate('/', { state: { search: actor.trim() } });
                      }}
                      className="bau-button"
                      style={{ 
                        padding: '0.4rem 1rem', 
                        fontSize: '0.8rem', 
                        background: 'white',
                        boxShadow: '4px 4px 0px black'
                      }}
                    >
                      {actor.trim().toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
      </div>

      {/* Streaming Section */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        style={{ marginTop: '5rem' }}
      >
        <div style={{ background: 'var(--bau-blue)', color: 'white', padding: '1rem 2rem', border: 'var(--bau-border-width) solid var(--bau-black)', display: 'inline-block', marginBottom: '2rem', boxShadow: '8px 8px 0px var(--bau-red)' }}>
          <h2 className="bau-heading" style={{ fontSize: '2rem' }}>STREAMING_MODULE</h2>
        </div>

        <div style={{ 
          background: 'var(--bau-yellow)', 
          padding: '1rem 2rem', 
          border: 'var(--bau-border-width-sm) solid var(--bau-black)', 
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          boxShadow: '4px 4px 0px black'
        }}>
          <AlertTriangle size={24} />
          <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>
            EXTERNAL_ADVISORY: IF STREAM IS "NOT AVAILABLE", PLEASE SWITCH SERVERS. ENSURE ADBLOCKERS ARE ACTIVE FOR BEST EXPERIENCE.
          </p>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <span className="bau-heading" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>ACTIVE_SERVER_SELECTION</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {servers.map(server => (
                <button
                  key={server.id}
                  onClick={() => setActiveServer(server.id)}
                  className="bau-button"
                  style={{
                    background: activeServer === server.id ? 'var(--bau-red)' : 'var(--bau-white)',
                    color: activeServer === server.id ? 'white' : 'black',
                    padding: '0.5rem 1.2rem',
                    fontSize: '0.8rem',
                    boxShadow: activeServer === server.id ? 'none' : '4px 4px 0px black',
                    transform: activeServer === server.id ? 'translate(2px, 2px)' : 'none'
                  }}
                >
                  {server.name}
                </button>
              ))}
              <button 
                onClick={() => setRefreshKey(prev => prev + 1)}
                className="bau-button"
                style={{ background: 'var(--bau-black)', color: 'white', padding: '0.5rem 1rem', boxShadow: '4px 4px 0px var(--bau-blue)' }}
                title="RELOAD PLAYER"
              >
                <RefreshCw size={16} className={refreshKey % 2 !== 0 ? 'spin' : ''} />
              </button>
            </div>
          </div>

          {isSeries && (
            <div style={{ display: 'flex', gap: '1.5rem', background: 'var(--bau-white)', padding: '1rem', border: 'var(--bau-border-width-sm) solid var(--bau-black)', boxShadow: '8px 8px 0px var(--bau-yellow)' }}>
              <div>
                <span className="bau-heading" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>SEASON_INDEX</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="bau-button" style={{ padding: '0.2rem 0.6rem' }} onClick={() => setSeason(s => Math.max(1, s - 1))}>-</button>
                  <span style={{ fontWeight: 900, minWidth: '30px', textAlign: 'center' }}>{season}</span>
                  <button className="bau-button" style={{ padding: '0.2rem 0.6rem' }} onClick={() => setSeason(s => s + 1)}>+</button>
                </div>
              </div>
              <div style={{ width: '2px', background: 'var(--bau-black)' }}></div>
              <div>
                <span className="bau-heading" style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.5rem' }}>EPISODE_INDEX</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button className="bau-button" style={{ padding: '0.2rem 0.6rem' }} onClick={() => setEpisode(e => Math.max(1, e - 1))}>-</button>
                  <span style={{ fontWeight: 900, minWidth: '30px', textAlign: 'center' }}>{episode}</span>
                  <button className="bau-button" style={{ padding: '0.2rem 0.6rem' }} onClick={() => setEpisode(e => e + 1)}>+</button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ 
          width: '100%', 
          aspectRatio: '16/9', 
          background: 'var(--bau-black)', 
          border: 'var(--bau-border-width) solid var(--bau-black)',
          boxShadow: '12px 12px 0px var(--bau-black)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <iframe 
            key={`${activeServer}-${season}-${episode}-${refreshKey}`}
            src={embedUrl}
            title="Video Player"
            frameBorder="0"
            allowFullScreen
            style={{ width: '100%', height: '100%' }}
          ></iframe>
          
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            padding: '1rem', 
            background: 'var(--bau-red)', 
            color: 'white', 
            fontSize: '0.7rem', 
            fontWeight: 900,
            borderBottom: '2px solid black',
            borderRight: '2px solid black',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            STREAM_CORE::{activeServer}
          </div>

          <div style={{ 
            position: 'absolute', 
            bottom: 0, 
            right: 0, 
            padding: '0.5rem 1rem', 
            background: 'var(--bau-yellow)', 
            color: 'black', 
            fontSize: '0.6rem', 
            fontWeight: 900,
            borderTop: '2px solid black',
            borderLeft: '2px solid black',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {isSeries ? `S${season}:E${episode}` : 'FEATURE_FILM'}
          </div>
        </div>
      </motion.div>

      {/* Soundtrack Section */}
      {songs.length > 0 && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{ marginTop: '5rem' }}
        >
          <div style={{ background: 'var(--bau-yellow)', color: 'black', padding: '1rem 2rem', border: 'var(--bau-border-width) solid var(--bau-black)', display: 'inline-block', marginBottom: '2rem', boxShadow: '8px 8px 0px var(--bau-blue)' }}>
            <h2 className="bau-heading" style={{ fontSize: '2rem' }}>AUDITORY_COMPOSITION</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {songs.map((song, idx) => (
              <div key={idx} className="bau-card" style={{ 
                padding: '1rem', 
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
              }}>
                <div style={{ 
                  width: '80px', 
                  height: '80px', 
                  border: '2px solid var(--bau-black)',
                  borderRadius: idx % 2 === 0 ? '50%' : '0',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={song.artworkUrl100 || song.artworkUrl60} 
                    alt={song.trackName} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 className="bau-heading" style={{ fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {song.trackName.toUpperCase()}
                  </h4>
                  <p style={{ margin: '0.2rem 0 0.8rem 0', fontWeight: 700, color: 'var(--bau-red)', fontSize: '0.8rem' }}>
                    {song.artistName.toUpperCase()}
                  </p>
                  {song.previewUrl && (
                    <audio controls src={song.previewUrl} style={{ width: '100%', height: '24px' }}></audio>
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




