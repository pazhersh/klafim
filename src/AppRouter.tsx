import { BrowserRouter, Route, Routes } from "react-router";
import NotFoundPage from './NotFoundPage';
import TableTopPage from './TableTopPage';
import UploadExcelPage from './UploadExcelPage/UploadExcelPage';

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path='/*' element={<NotFoundPage />} />
            <Route path='/upload' element={<UploadExcelPage />} />
            <Route path='/table-top' element={<TableTopPage />} />
        </Routes>
    </BrowserRouter>
}
