import { useState, useMemo, useEffect } from 'react';
import ExcelTable from './excel/ExcelTable';
import xlsx from 'xlsx';

export default function test() {
    const [sheet, setSheet] = useState();

    const onChange = async (newFile) => {
        const fileData = await newFile.arrayBuffer();
        const workbook = xlsx.read(fileData);
        setSheet(workbook.Sheets[workbook.SheetNames[1]]);

    };

    return <div>
        <input type='file' onChange={async (event) => onChange(event.target.files[0])} />
        {sheet && <ExcelTable sheet={sheet} />}
    </div>
}