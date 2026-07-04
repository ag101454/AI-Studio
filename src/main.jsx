import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app/App'
import './styles/index.css'

/**
 * Application Entry Point
 * 
 * Architecture Decisions:
 * 1. BrowserRouter wraps everything - routing is global
 * 2. React.StrictMode catches potential problems during development
 * 3. Styles are imported here so they're available globally
 * 
 * In production, you'd also add:
 * - Error boundary
 * - Analytics providers
 * - Feature flag providers
 * 
 * But we keep it minimal at the start and add complexity only when needed.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)