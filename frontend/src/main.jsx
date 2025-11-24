import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DataViz from './data-viz.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataViz />
  </StrictMode>,
)
