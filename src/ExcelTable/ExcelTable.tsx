import xlsx from 'xlsx';
import './ExcelTable.css'
import useTableSelectionStore from '../useTableSelectionStore';

export default function ExcelTable({ sheet }) {
    const sheetData: object[] = xlsx.utils.sheet_to_json(sheet, {
        skipHidden: false,
        blankrows: false,
        defval: null
    });

    const { getItemAt, addSelection, removeSelection } = useTableSelectionStore();

    const onCellClick = ({ column, row, value }) => {
        if (getItemAt([column, row])) {
            removeSelection([column, row]);
        }
        else {
            addSelection({
                coords: [column, row],
                value: value
            });
        }
    };

    if (!sheetData.length) {
        return;
    }

    const headers = Object.keys(sheetData[0]);

    return <table>
        <thead>
            <tr>
                <td></td>
                {headers.map((header) => <td className='table-title'>
                    {header}
                </td>)}
            </tr>
        </thead>
        <tbody>
            {sheetData.map((rowData, row) => <tr>
                <td className='table-title'>{row}</td>
                {headers.map((header, column) => <td className='data'>
                    <button onClick={() => onCellClick({ row, column, value: rowData[header] })}>
                        {rowData[header]}
                    </button>
                </td>)}
            </tr>)}
        </tbody>
    </table>
}