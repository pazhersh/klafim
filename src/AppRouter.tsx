import { BrowserRouter, Route, Routes } from "react-router";
import NotFoundPage from './Pages/NotFoundPage';
import TableTopPage from './Pages/TableTop/TableTopPage';
import UploadExcelPage from './Pages/UploadExcelPage/UploadExcelPage';
import ClickableLayout from "./Pages/ClickableLayout";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path='/table-top' element={<TableTopPage />} />
            <Route element={<ClickableLayout />} >
                <Route path='/*' element={<NotFoundPage />} />
                <Route path='/upload' element={<UploadExcelPage />} />
            </Route>
        </Routes>
    </BrowserRouter >
}
