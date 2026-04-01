# MovieVerse Explorer 🎬

A dynamic web application to browse and discover movies. Built using HTML, CSS and JavaScript with the OMDB API.

## Features ✨
- **Movie Search** - Search any movie by name with real-time search
- **Movie Details** - Click on any movie to see full details like cast, director, ratings, plot
- **Watch Movies** - Watch movies online for free with multiple server options
- **Soundtrack** - Listen to movie soundtracks using iTunes API integration
- **YouTube Trailers** - Quick link to watch trailers on YouTube
- **Responsive Design** - Works on mobile, tablet and desktop
- **Load More** - Pagination to load more search results
- **Smooth Animations** - Background gradient animation and hover effects

## Technologies Used 🛠️
- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+, Async/Await, Fetch API)
- OMDB API (movie database)
- iTunes Search API (soundtracks)
- Font Awesome (icons)
- Google Fonts (Poppins)

## API Used 🔑
- **OMDB API** - For fetching movie data, details, ratings
- **iTunes Search API** - For fetching movie soundtracks

## How to Run 🚀
1. Clone the repository
2. Open `index.html` in your browser
3. Search for any movie and explore!

## Project Structure 📁
```
MovieVerse/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # All styling
├── js/
│   ├── api.js          # API call functions
│   ├── utils.js        # Helper functions
│   └── main.js         # Main app logic
└── README.md
```

## Screenshots 📸
- Home page with trending movies grid
- Search functionality with auto-complete
- Movie details modal with full information
- Embedded video player with server switching
- Soundtrack section with audio preview

## Higher Order Functions Used 📚
- `Array.prototype.sort()` - For shuffling movies
- `Array.prototype.filter()` - For removing duplicates (using seen ids)
- `Array.prototype.concat()` - For merging movie arrays
- `debounce()` - Custom HOF for search optimization
- `encodeURIComponent()` - For encoding search queries
- `addEventListener()` - Event handling callbacks

## Learnings 📖
- How to work with REST APIs using fetch()
- Async/await for handling promises
- DOM manipulation with JavaScript
- CSS Grid and Flexbox for layouts
- Event handling and delegation
- Debouncing for performance optimization

## Made By
**Siddhant** - First Year Student

---
*This project was made as part of learning web development with HTML, CSS and JavaScript.*
