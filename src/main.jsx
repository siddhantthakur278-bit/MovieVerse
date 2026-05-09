import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ListsProvider } from './context/ListsContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ListsProvider>
      <App />
    </ListsProvider>
  </React.StrictMode>,
)
