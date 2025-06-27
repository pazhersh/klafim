import xlsx from 'xlsx';
import './ExcelTable.css'

export default function ExcelTable({ sheet }) {
    const sheetData: object[] = xlsx.utils.sheet_to_json(sheet, {
        skipHidden: false,
        blankrows: false,
        defval: null
    });

    if (!sheetData.length) {
        return;
    }

    const headers = Object.keys(sheetData[0]);

    console.log(headers);
    return <table>
        <tr>
            <td></td>
            {headers.map((header) => <td className='table-title'>
                {header}
            </td>)}
        </tr>
        {sheetData.map((rowData, index) => <tr>
            <td className='table-title'>{index}</td>
            {headers.map((header) => <td className='data'>
                {rowData[header]}
            </td>)}
        </tr>)}
    </table>
}