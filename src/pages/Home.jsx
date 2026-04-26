import React, { useState, useEffect } from 'react';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { motion } from 'framer-motion';

const defaultQueries = ['Avengers', 'Batman', 'Inception', 'Dangal', 'RRR', 'Avatar', 'Interstellar', 'Joker'];

const Home = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    fetchData(1, searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchData(page, searchQuery, true);
    }
  }, [page]);

  const fetchData = async (pageNum, query, append = false) => {
    if (pageNum === 1) setLoading(true);
    setError(null);
    try {
      if (query) {
        const data = await searchMovies(query, pageNum);
        if (data.Search) {
          setMovies(prev => append ? [...prev, ...data.Search] : data.Search);
          setHasMore(data.totalResults > pageNum * 10);
        } else {
          setMovies([]);
          setHasMore(false);
        }
      } else {
        // Load random popular if no query
        const promises = defaultQueries.map(q => searchMovies(q, 1).catch(() => null));
        const results = await Promise.all(promises);
        let allMovies = [];
        results.forEach(res => {
          if (res && res.Search) {
            allMovies = [...allMovies, ...res.Search];
          }
        });
        
        // Filter out N/A posters and remove duplicates
        const uniqueMovies = [];
        const seen = new Set();
        allMovies.forEach(m => {
          if (m.Poster !== 'N/A' && !seen.has(m.imdbID)) {
            seen.add(m.imdbID);
            uniqueMovies.push(m);
          }
        });
        
        // Shuffle
        uniqueMovies.sort(() => 0.5 - Math.random());
        
        setMovies(uniqueMovies.slice(0, 20));
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {!searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '2rem' }}
        >
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>
            Discover Your Next <span style={{ color: '#e50914' }}>Favorite</span> Movie
          </h1>
          <p style={{ color: '#a3a3a3', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            Explore an endless universe of movies, series, and shows. High quality details and soundtracks just a click away.
          </p>
        </motion.div>
      )}

      {searchQuery && (
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
          Results for <span style={{ color: '#e50914' }}>"{searchQuery}"</span>
        </h2>
      )}

      {!searchQuery && !loading && (
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: '5px', height: '24px', background: '#e50914', borderRadius: '5px' }}></div>
          Trending Now
        </h2>
      )}

      {loading && page === 1 ? (
        <div className="loader-container">
          <div className="spinner"></div>
        </div>
      ) : error && page === 1 ? (
        <div style={{ textAlign: 'center', color: '#ff4b4b', padding: '3rem', background: 'rgba(255,75,75,0.1)', borderRadius: '12px' }}>
          <h2>Oops!</h2>
          <p>{error}</p>
        </div>
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#a3a3a3', padding: '3rem' }}>
          <h2>No movies found</h2>
          <p>Try adjusting your search terms</p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '2rem',
          }}>
            {movies.map((movie, idx) => (
              <MovieCard key={movie.imdbID + idx} movie={movie} index={idx} />
            ))}
          </div>

          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPage(p => p + 1)}
                style={{
                  background: '#e50914',
                  color: 'white',
                  border: 'none',
                  padding: '0.8rem 2rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(229, 9, 20, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {loading && page > 1 ? <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div> : null}
                {loading && page > 1 ? 'Loading...' : 'Load More'}
              </motion.button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
