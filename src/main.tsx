import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import UploadExcelPage from './UploadExcelPage/UploadExcelPage'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UploadExcelPage />
    </StrictMode>,
)
