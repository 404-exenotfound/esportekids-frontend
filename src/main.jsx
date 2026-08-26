import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@fontsource/press-start-2p";
import './index.css'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
 