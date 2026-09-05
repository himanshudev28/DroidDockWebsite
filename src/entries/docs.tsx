import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DocsPage } from '../pages/DocsPage'
import '../index.css'

const root = document.getElementById('root')
if (!root) throw new Error('#root missing from the page shell')

createRoot(root).render(
  <StrictMode>
    <DocsPage />
  </StrictMode>,
)
