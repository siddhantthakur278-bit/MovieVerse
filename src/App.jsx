import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MyLists from './pages/MyLists';
import { ListsProvider } from './context/ListsContext';

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ListsProvider>
      <Router>
        <div className="app-container">
          <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <main style={{ padding: '0 5% 5rem 5%', flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/lists" element={<MyLists />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ListsProvider>
  );
}

export default App;

