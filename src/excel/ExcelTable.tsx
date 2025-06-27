import xlsx from 'xlsx';

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
            {headers.map((header) => <td>
                {header}
            </td>)}
        </tr>
        {sheetData.map((rowData) => <tr>
            {headers.map((header) => <td>
                {rowData[header]}
            </td>)}
        </tr>)}
    </table>
}