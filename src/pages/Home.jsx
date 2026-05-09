import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { useLists } from '../context/ListsContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Film, TrendingUp, Tv, Sparkles, Plus, BrainCircuit } from 'lucide-react';

const Home = ({ searchQuery }) => {
  const location = useLocation();
  const { liked } = useLists();
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [categoryMovies, setCategoryMovies] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('BOLLYWOOD');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const categories = [
    { id: 'BOLLYWOOD', label: 'BOLLYWOOD', keyword: 'hindi' },
    { id: 'HOLLYWOOD', label: 'HOLLYWOOD', keyword: 'marvel' },
    { id: 'ANIME', label: 'ANIME', keyword: 'anime' },
    { id: 'SCIFI', label: 'SCI_FI', keyword: 'interstellar' },
  ];

  // Handle Cast Explorer Search
  const effectiveQuery = searchQuery || location.state?.search;

  const fetchCategoryMovies = async (p, isLoadMore = false) => {
    try {
      const query = effectiveQuery || categories.find(c => c.id === activeCategory).keyword;
      const data = await searchMovies(query, p);
      if (data.Search) {
        if (isLoadMore) {
          setCategoryMovies(prev => [...prev, ...data.Search]);
        } else {
          setCategoryMovies(data.Search);
        }
        setHasMore(data.Search.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setPage(1);
      try {
        if (!effectiveQuery) {
          // Fetch 2 pages for Trending
          const t1 = await searchMovies('2024', 1);
          const t2 = await searchMovies('2024', 2);
          setTrendingMovies([...(t1.Search || []), ...(t2.Search || [])]);

          // Fetch Series
          const s1 = await searchMovies('series', 1);
          const s2 = await searchMovies('thrones', 1);
          setPopularSeries([...(s1.Search || []), ...(s2.Search || [])]);

          // AI RECOMMENDATIONS LOGIC
          if (liked.length > 0) {
            const randomLiked = liked[Math.floor(Math.random() * liked.length)];
            const recData = await searchMovies(randomLiked.Title.split(' ')[0], 1);
            setAiRecommendations(recData.Search?.slice(0, 8) || []);
          }
        }
        await fetchCategoryMovies(1);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [effectiveQuery, activeCategory]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategoryMovies(nextPage, true);
  };

  const SectionHeader = ({ title, icon: Icon, color, sub }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1.5rem', 
      marginBottom: '2.5rem',
      marginTop: '5rem',
      borderLeft: `12px solid ${color}`,
      paddingLeft: '1.5rem'
    }}>
      <Icon size={32} color="var(--bau-black)" />
      <div>
        <h2 className="bau-heading" style={{ fontSize: '2.5rem' }}>{title}</h2>
        {sub && <p style={{ fontSize: '0.8rem', fontWeight: 900, color }}>{sub.toUpperCase()}</p>}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '6rem' }}>
      {!effectiveQuery && (
        <>
          {/* Landing Hero */}
          <section className="hero-section">
            <div style={{ padding: '4rem 3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ background: 'var(--bau-red)', color: 'white', padding: '5px 15px', alignSelf: 'flex-start', fontWeight: 900, marginBottom: '1.5rem', border: '2px solid black' }}
              >
                PREMIUM_COLLECTION_V2.5
              </motion.div>
              <motion.h1 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bau-display"
                style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 0.85, marginBottom: '2rem' }}
              >
                CINEMA_<br />
                <span style={{ color: 'var(--bau-blue)' }}>GEOMETRY_</span><br />
                <span style={{ color: 'var(--bau-yellow)' }}>DYNAMICS_</span>
              </motion.h1>
              
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                <button className="bau-button bau-button-primary" style={{ padding: '1rem 2rem', fontSize: '1.2rem' }}>
                  <TrendingUp /> TRENDING_NOW
                </button>
              </div>
            </div>

            <div className="hero-composition" style={{ 
              background: 'var(--bau-yellow)', 
              borderLeft: 'var(--bau-border-width) solid var(--bau-black)',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                style={{ position: 'absolute', width: '400px', height: '400px', border: '2px dashed var(--bau-black)', borderRadius: '50%', opacity: 0.2 }}
              />
              <div style={{ zIndex: 1, textAlign: 'center' }}>
                <Sparkles size={100} strokeWidth={1.5} color="var(--bau-red)" />
              </div>
            </div>
          </section>

          {/* AI Recommendations */}
          <AnimatePresence>
            {aiRecommendations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
                <SectionHeader 
                  title="RECOMMENDED_FOR_YOU" 
                  icon={BrainCircuit} 
                  color="var(--bau-blue)" 
                  sub="ANALYZING_LIKED_COLLECTION"
                />
                <div className="movie-grid">
                  {aiRecommendations.map((movie, idx) => (
                    <MovieCard key={movie.imdbID + 'rec' + idx} movie={movie} index={idx} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trending Movies Section */}
          <SectionHeader title="TRENDING_MOVIES" icon={TrendingUp} color="var(--bau-red)" />
          <div className="movie-grid">
            {trendingMovies.map((movie, idx) => (
              <MovieCard key={movie.imdbID + 'trending' + idx} movie={movie} index={idx} />
            ))}
          </div>

          {/* Popular Series Section */}
          <SectionHeader title="POPULAR_SERIES" icon={Tv} color="var(--bau-blue)" />
          <div className="movie-grid">
            {popularSeries.map((movie, idx) => (
              <MovieCard key={movie.imdbID + 'series' + idx} movie={movie} index={idx} />
            ))}
          </div>

          {/* Categories Section */}
          <SectionHeader title="EXPLORE_CATEGORIES" icon={Film} color="var(--bau-yellow)" />
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '3rem', 
            overflowX: 'auto', 
            padding: '1rem 0',
            scrollbarWidth: 'none'
          }}>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className="bau-button"
                style={{
                  background: activeCategory === cat.id ? 'var(--bau-black)' : 'var(--bau-white)',
                  color: activeCategory === cat.id ? 'white' : 'black',
                  padding: '0.8rem 2rem',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  boxShadow: activeCategory === cat.id ? 'none' : '4px 4px 0px var(--bau-red)',
                  transform: activeCategory === cat.id ? 'translate(4px, 4px)' : 'none'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </>
      )}

      {effectiveQuery && (
        <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
          <SectionHeader title={`RESULTS_FOR: ${effectiveQuery.toUpperCase()}`} icon={Film} color="var(--bau-red)" />
        </div>
      )}

      {loading && page === 1 ? (
        <div className="loader-container" style={{ height: '40vh' }}>
          <div className="bau-spinner"></div>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bau-red)', color: 'white', border: '4px solid black' }}>
          <h2 className="bau-heading">TRANSMISSION_ERROR</h2>
          <p>{error.toUpperCase()}</p>
        </div>
      ) : (
        <>
          <div className="movie-grid">
            {categoryMovies.map((movie, idx) => (
              <MovieCard key={movie.imdbID + idx} movie={movie} index={idx} />
            ))}
          </div>
          
          {hasMore && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '5rem' }}>
              <button 
                onClick={loadMore} 
                className="bau-button bau-button-yellow"
                style={{ padding: '1.5rem 4rem', fontSize: '1.2rem', gap: '1rem' }}
              >
                <Plus size={24} /> LOAD_MORE_CONTENT
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;



