import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HomePage } from '../pages/HomePage'
import '../index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root missing from the page shell')

createRoot(root).render(
  <StrictMode>
    <HomePage />
  </StrictMode>,
)
