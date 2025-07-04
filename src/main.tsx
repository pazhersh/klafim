import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Router from './AppRouter';
import { initDecks } from './decksUtils';

initDecks();

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Router />
    </StrictMode>,
)
