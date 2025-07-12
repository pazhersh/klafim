import { BrowserRouter, Route, Routes } from "react-router";
import NotFoundPage from './Pages/NotFoundPage';
import TableTopPage from './Pages/TableTop/TableTopPage';
import ClickableLayout from "./Pages/ClickableLayout";
import ManageDecks from "./Pages/ManageDecks/ManageDecks";
import ManageDeck from "./Pages/ManageDeck/ManageDeck";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path='/table-top' element={<TableTopPage />} />
            <Route element={<ClickableLayout />} >
                <Route path='/*' element={<NotFoundPage />} />
                <Route path='/manage-decks' element={<ManageDecks />} />
                <Route path='/manage-decks/:deckId' element={<ManageDeck />} />
            </Route>
        </Routes>
    </BrowserRouter >
}
