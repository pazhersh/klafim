import { useState } from 'react';
import ExcelTable from '../ExcelTable/ExcelTable';
import xlsx from 'xlsx';
import './UploadExcelPage.css';

export default function test() {
    const [sheet, setSheet] = useState();

    const onChange = async (newFile) => {
        const fileData = await newFile.arrayBuffer();
        const workbook = xlsx.read(fileData);
        setSheet(workbook.Sheets[workbook.SheetNames[1]]);

    };

    return <div className='container'>
        <div className='pane table-container'>
            <input type='file' onChange={async (event) => onChange(event.target.files[0])} className='table-header' />
            {sheet && <div className='table-data'>
                <ExcelTable sheet={sheet} />
            </div>}
        </div>

        <div className='pane' style={{ backgroundColor: 'lightblue' }}>
            placeholder for deck preview
        </div>
    </div>
}