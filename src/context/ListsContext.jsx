import React, { createContext, useContext, useState, useEffect } from 'react';

const ListsContext = createContext();

export const ListsProvider = ({ children }) => {
  const [watchLater, setWatchLater] = useState([]);
  const [liked, setLiked] = useState([]);
  const [bucketList, setBucketList] = useState([]);
  const [vision, setVision] = useState(localStorage.getItem('bau_vision') || 'modernist');

  // Load initial lists
  useEffect(() => {
    setWatchLater(JSON.parse(localStorage.getItem('watchLater') || '[]'));
    setLiked(JSON.parse(localStorage.getItem('liked') || '[]'));
    setBucketList(JSON.parse(localStorage.getItem('bucketList') || '[]'));
  }, []);

  // Persist lists
  useEffect(() => {
    localStorage.setItem('watchLater', JSON.stringify(watchLater));
  }, [watchLater]);

  useEffect(() => {
    localStorage.setItem('liked', JSON.stringify(liked));
  }, [liked]);

  useEffect(() => {
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
  }, [bucketList]);

  // Handle Vision Modes
  useEffect(() => {
    document.body.className = '';
    if (vision !== 'modernist') {
      document.body.classList.add(`vision-${vision}`);
    }
    localStorage.setItem('bau_vision', vision);
  }, [vision]);

  const toggleList = (listType, movie) => {
    const listMap = {
      watchLater: [watchLater, setWatchLater],
      liked: [liked, setLiked],
      bucketList: [bucketList, setBucketList]
    };
    
    const [list, setList] = listMap[listType];
    const exists = list.find(m => m.imdbID === movie.imdbID);
    
    if (exists) {
      setList(list.filter(m => m.imdbID !== movie.imdbID));
    } else {
      setList([...list, movie]);
    }
  };

  const isInList = (listType, imdbID) => {
    const lists = { watchLater, liked, bucketList };
    return lists[listType].some(m => m.imdbID === imdbID);
  };

  return (
    <ListsContext.Provider value={{ 
      watchLater, 
      liked, 
      bucketList, 
      toggleList, 
      isInList,
      vision,
      setVision
    }}>
      {children}
    </ListsContext.Provider>
  );
};

export const useLists = () => useContext(ListsContext);
