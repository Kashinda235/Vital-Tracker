import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HealthcareManagementSystem from './healthcare-system.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HealthcareManagementSystem />
  </StrictMode>,
)
