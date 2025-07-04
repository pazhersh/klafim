import { useState } from 'react';
import xlsx, { WorkSheet } from 'xlsx';
import DeckPreview from '../../Components/DeckPreview';
import ExcelTable from '../../ExcelTable/ExcelTable';
import useTableSelectionStore from '../../useTableSelectionStore';
import styles from './UploadExcelPage.module.css';

export default function UploadExcelPage() {
    const [sheet, setSheet] = useState<WorkSheet>();

    const onChange = async (newFile?: File) => {
        if (!newFile) {
            return;
        }

        const fileData = await newFile.arrayBuffer();
        const workbook = xlsx.read(fileData);
        setSheet(workbook.Sheets[workbook.SheetNames[1]]);
    };

    const selections = useTableSelectionStore((state) => state.selections);
    const cardValues = Array.from(selections.values()).map((selection) => selection.value);

    return <div className={styles.container}>
        <div className={`${styles.pane} ${styles.tableContainer}`}>
            <input type='file' onChange={async (event) => onChange(event.target.files?.[0])} className='table-header' />
            {sheet && <div className={styles.tableData}>
                <ExcelTable sheet={sheet} />
            </div>}
        </div>

        <div className={styles.pane} style={{ backgroundColor: 'lightblue' }}>
            placeholder for deck preview;
            <div style={{ overflow: 'auto' }}>
                <DeckPreview values={cardValues} />
            </div>
        </div>
    </div>
}