import { BrowserRouter, Route, Routes } from "react-router";
import AboutPage from "./Pages/AboutPage";
import ClickableLayout from "./Pages/ClickableLayout";
import HomePage from "./Pages/HomePage/HomePage";
import ManageDeck from "./Pages/ManageDeck/ManageDeck";
import ManageDecks from "./Pages/ManageDecks/ManageDecks";
import NotFoundPage from './Pages/NotFoundPage';
import TableTopPage from './Pages/TableTop/TableTopPage';

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path='/table-top' element={<TableTopPage />} />
            <Route element={<ClickableLayout />} >
                <Route path='/' element={<HomePage />} />
                <Route path='/*' element={<NotFoundPage />} />
                <Route path='/manage-decks' element={<ManageDecks />} />
                <Route path='/manage-decks/:deckId' element={<ManageDeck />} />
                <Route path='/about' element={<AboutPage />} />
            </Route>
        </Routes>
    </BrowserRouter >
}
