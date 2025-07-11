import { useMemo, useState } from 'react';
import styles from './ExcelDeckEditor.module.css'
import xlsx, { WorkSheet } from 'xlsx';

export default function ExcelDeckEditor() {
    const [sheet, setSheet] = useState<WorkSheet>();

    const data = useMemo<object[] | undefined>(() => !sheet ? undefined : xlsx.utils.sheet_to_json(sheet, {
        skipHidden: false,
        blankrows: false,
        defval: null
    }), [sheet])

    const headers = Object.keys(data?.[0] ?? {});

    const onExcelUpload = async (newFile?: File) => {
        if (!newFile) {
            return;
        }

        const fileData = await newFile.arrayBuffer();
        const workbook = xlsx.read(fileData);
        setSheet(workbook.Sheets[workbook.SheetNames[1]]);
    };

    return <div className={styles.container}>
        {(!sheet || !data) &&
            <label htmlFor='emptyUpload' className={styles.emptyUploadContainer}>
                <input id='emptyUpload' className={styles.emptyUpload} type='file' onChange={async (event) => onExcelUpload(event.target.files?.[0])} />
            </label>
        }

        {data &&
            <table>
                <thead>
                    <tr>
                        <td></td>
                        {headers.map((header) => <td className={`${styles.cell} ${styles.columnTitle}`}>
                            {header}
                        </td>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((rowData, row) => <tr className={styles.row}>
                        <td className={`${styles.cell} ${styles.rowTitle}`}>{row}</td>
                        {headers.map((header, column) => <td className={`${styles.cell} ${styles.dataContainer}`}>
                            <button
                                className={`${styles.cellButton} ${'getItemAt([column, row])' ? styles.selectedCellButton : ''}`}
                                onClick={() => onCellClick({ row, column, value: rowData[header] })}
                            >
                                {rowData[header]}
                            </button>
                        </td>)}
                    </tr>)}
                </tbody>
            </table>
        }
    </div>
}