import { BrowserRouter, Route, Routes } from "react-router";
import NotFoundPage from './NotFoundPage';
import TableTopPage from './TableTopPage/TableTopPage';
import UploadExcelPage from './UploadExcelPage/UploadExcelPage';
import TestPage from "./TableTopPage/TestPage";

export default function AppRouter() {
    return <BrowserRouter>
        <Routes>
            <Route path='/*' element={<NotFoundPage />} />
            <Route path='/upload' element={<UploadExcelPage />} />
            <Route path='/table-top' element={<TableTopPage />} />
            <Route path='/test' element={<TestPage />} />
        </Routes>
    </BrowserRouter>
}
