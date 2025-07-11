import { useMemo, useState } from 'react';
import styles from './ExcelDeckEditor.module.css'
import xlsx, { WorkSheet } from 'xlsx';

type CellCoordinates = {
    row: number;
    column: number;
}

export default function ExcelDeckEditor() {
    const [sheet, setSheet] = useState<WorkSheet>();

    const data = useMemo<(string | number | undefined)[][] | undefined>(() => !sheet ? undefined : xlsx.utils.sheet_to_json(sheet, {
        skipHidden: false,
        blankrows: false,
        defval: null
    }), [sheet])


    const [selectedItems, setSelectedItems] = useState<CellCoordinates[]>([])

    const findSelection = ({ row, column }: CellCoordinates) =>
        selectedItems.find(
            (selection) => (selection.row === row && selection.column === column)
        );

    const selectItem = ({ row, column }: CellCoordinates) => {
        if (!findSelection({ row, column })) {
            setSelectedItems([...selectedItems, { row, column }]);
        }
    };

    const deselectItem = ({ row, column }: CellCoordinates) => {
        setSelectedItems(
            selectedItems.filter(
                ({ row: selectedRow, column: selectedColumn }) => !(selectedRow === row && selectedColumn === column)
            )
        );
    };

    const onColumnTitleClick = (column: number) => {
        const selectedInColumn = selectedItems.filter((coordinate) => coordinate.column === column);

        if (!data) {
            return;
        }

        if (selectedInColumn.length === data.length) {
            const newSelectedItems = selectedItems
                .filter((selection) => selectedInColumn.every((selectionInColumn) => selectionInColumn !== selection));
            setSelectedItems(newSelectedItems);
        } else {
            const itemsToAdd = data.map((_roots, row) => ({ row, column }))
                .filter(({ row, column }) => selectedItems.every((selection) => (selection.row !== row || selection.column !== column)));
            setSelectedItems([...selectedItems, ...itemsToAdd]);
        }
    };

    const onRowTitleClick = (row: number) => {
        const selectedInRow = selectedItems.filter((coordinate) => coordinate.row === row);

        if (!data) {
            return;
        }

        if (selectedInRow.length === headers.length) {
            const newSelectedItems = selectedItems
                .filter((selection) => selectedInRow.every((selectionInColumn) => selectionInColumn !== selection));
            setSelectedItems(newSelectedItems);
        } else {
            const itemsToAdd = headers.map((_, column) => ({ row, column }))
                .filter(({ row, column }) => selectedItems.every((selection) => (selection.row !== row || selection.column !== column)));
            setSelectedItems([...selectedItems, ...itemsToAdd]);
        }
    };

    const onCellClick = (coordinates: CellCoordinates) => {
        if (!findSelection(coordinates)) {
            selectItem(coordinates);
        } else {
            deselectItem(coordinates);
        }
    };

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
                        {headers.map((header, column) => <td className={`${styles.cell} ${styles.columnTitle}`}>
                            <button
                                className={`${styles.cell} ${styles.columnTitle} ${styles.button}`}
                                onClick={() => onColumnTitleClick(column)}
                            >
                                <p>{header}</p>
                                <p>V</p>
                            </button>
                        </td>)}
                    </tr>
                </thead>
                <tbody>
                    {data.map((rowData, row) => <tr className={styles.row}>
                        <td className={`${styles.cell} ${styles.rowTitle}`}>
                            <button
                                className={`${styles.cell} ${styles.rowTitle} ${styles.button}`}
                                onClick={() => onRowTitleClick(row)}
                            >
                                {row} {'>'}
                            </button>
                        </td>

                        {headers.map((header, column) => <td className={`${styles.cell} ${styles.dataContainer} ${findSelection({ row, column }) ? styles.selected : ''}`}>
                            <button
                                className={`${styles.cell} ${styles.dataContainer} ${styles.button}`}
                                onClick={() => onCellClick({ row, column })}
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