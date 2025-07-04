import { BrowserRouter, Route, Routes } from "react-router";
import NotFoundPage from './Pages/NotFoundPage';
import TableTopPage from './Pages/TableTop/TableTopPage';
import UploadExcelPage from './Pages/UploadExcelPage/UploadExcelPage';

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path='/*' element={<NotFoundPage />} />
            <Route path='/upload' element={<UploadExcelPage />} />
            <Route path='/table-top' element={<TableTopPage />} />
        </Routes>
    </BrowserRouter>
}
