import { useState } from 'react';
import xlsx, { WorkSheet } from 'xlsx';
import DeckPreview from '../../Components/DeckPreview';
import ExcelTable from '../../Components/LegacyExcelTable/ExcelTable';
import useTableSelectionStore from '../../useTableSelectionStore';
import styles from './UploadExcelPage.module.css';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';

export default function UploadExcelPage() {
    const [sheet, setSheet] = useState<WorkSheet>();
    const [deckName, setDeckName] = useState('');
    const { createDeck } = useDecksStore()

    const onExcelUpload = async (newFile?: File) => {
        if (!newFile) {
            return;
        }

        const fileData = await newFile.arrayBuffer();
        const workbook = xlsx.read(fileData);
        setSheet(workbook.Sheets[workbook.SheetNames[1]]);
    };


    const selections = useTableSelectionStore((state) => state.selections);
    const cardValues = Array.from(selections.values()).map((selection) => selection.value);

    const onSaveDeck = () => {
        createDeck({ name: deckName, cardValues: cardValues.map(value => `${value}`) });
    };

    return <div className={styles.container}>
        <NavBar />

        <div className={`${styles.pane} ${styles.tableContainer}`}>
            <div className={styles.toolb0ar} >
                <label htmlFor='uploadExcel'>upload excel:</label>
                <input id='uploadExcel' type='file' onChange={async (event) => onExcelUpload(event.target.files?.[0])} />

                <label htmlFor='deckName'>deck title:</label>
                <input id='deckName' type='text' onChange={(event) => setDeckName(event.target.value)} />

                <button onClick={() => onSaveDeck()}>Save deck</button>
            </div>
            {sheet && <div className={styles.tableData}>
                <ExcelTable sheet={sheet} />
            </div>}
        </div>

        <div className={styles.pane} style={{ backgroundColor: 'lightblue' }}>
            placeholder for deck preview;
            <div style={{ overflow: 'auto' }}>
                <h2>{deckName}</h2>
                <DeckPreview deck={{ cardValues, name: 'placeholder' }} />
            </div>
        </div>
    </div>
}