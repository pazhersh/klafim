import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Test from './test.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Test />
    </StrictMode>,
)
