import { useMemo, useState } from 'react';
import styles from './ExcelEditor.module.css'
import xlsx, { WorkSheet } from 'xlsx';
import { cx } from '../../utils';
import type { CellCoordinates } from './types';
import FileUpload from '../FileUpload/FileUpload';

type ExcelDeckEditorProps = {
    onCellSelection?: (value: string, cell: CellCoordinates) => void,
    onCellDeselection?: (cell: CellCoordinates) => void,
    onMultiCellSelection?: (coordinates: Map<CellCoordinates, string>) => void,
    onMultiCellDeselection?: (coordinates: CellCoordinates[]) => void
};

type DataType = string | number | undefined | null;

// TODO: if there are preformance issues - it's probably because of all the redundant iterations
export default function ExcelDeckEditor({
    onCellSelection = () => { },
    onCellDeselection = () => { },
    onMultiCellSelection = () => { },
    onMultiCellDeselection = () => { }
}: ExcelDeckEditorProps) {
    const [sheet, setSheet] = useState<WorkSheet>();

    const data = useMemo<Record<string, DataType>[] | undefined>(() => !sheet ? undefined : xlsx.utils.sheet_to_json(sheet, {
        skipHidden: false,
        blankrows: false,
        defval: null
    }), [sheet])

    const headers = Object.keys(data?.[0] ?? {});

    const [selectedItems, setSelectedItems] = useState<CellCoordinates[]>([])

    const findSelection = ({ row, column }: CellCoordinates) =>
        selectedItems.find(
            (selection) => (selection.row === row && selection.column === column)
        );

    const getValue = ({ row, column }: CellCoordinates) => {
        const columnName = headers.at(column);

        if (columnName) {
            return data?.at(row)?.[columnName];
        }
    };

    const selectItem = ({ row, column }: CellCoordinates) => {
        if (!findSelection({ row, column })) {
            setSelectedItems([...selectedItems, { row, column }]);

            onCellSelection(getValue({ row, column })?.toString() ?? '', { row, column });
        }
    };

    const deselectItem = ({ row, column }: CellCoordinates) => {
        if (findSelection({ row, column })) {
            setSelectedItems(
                selectedItems.filter(
                    ({ row: selectedRow, column: selectedColumn }) => !(selectedRow === row && selectedColumn === column)
                )
            );

            onCellDeselection({ row, column });
        }
    };

    const onColumnTitleClick = (column: number) => {
        const selectedInColumn = selectedItems.filter((coordinate) => coordinate.column === column);

        if (!data) {
            return;
        }

        const dataCoordinates = data.map((_roots, row) => ({ row, column }));
        if (selectedInColumn.length === data.length) {
            const itemsToRemove = selectedItems
                .filter((selection) => dataCoordinates.some(({ row, column }) => (selection.row === row && selection.column === column)));

            const newSelectedItems = selectedItems.filter((selection) => !itemsToRemove.includes(selection));

            setSelectedItems(newSelectedItems);
            onMultiCellDeselection(itemsToRemove);
        } else {
            const itemsToAdd = dataCoordinates
                .filter(({ row, column }) => selectedItems.every((selection) => (selection.row !== row || selection.column !== column)));

            const newSelectionMap = new Map(itemsToAdd
                .map((coordinate) => ([coordinate, getValue(coordinate)?.toString()] as [CellCoordinates, string | undefined]))
                .filter(([_, value]) => value) as [CellCoordinates, string][]);

            setSelectedItems([...selectedItems, ...itemsToAdd]);
            onMultiCellSelection(newSelectionMap);
        }
    };

    const onRowTitleClick = (row: number) => {
        const selectedInRow = selectedItems.filter((coordinate) => coordinate.row === row);

        if (!data) {
            return;
        }


        const dataCoordinates = headers.map((_, column) => ({ row, column }));
        if (selectedInRow.length === headers.length) {
            const itemsToRemove = selectedItems
                .filter((selection) => dataCoordinates.some(({ row, column }) => (selection.row === row && selection.column === column)));

            const newSelectedItems = selectedItems.filter((selection) => !itemsToRemove.includes(selection));

            setSelectedItems(newSelectedItems);
            onMultiCellDeselection(itemsToRemove);
        } else {
            const itemsToAdd = dataCoordinates
                .filter(({ row, column }) => selectedItems.every((selection) => (selection.row !== row || selection.column !== column)));

            const newSelectionMap = new Map(itemsToAdd
                .map((coordinate) => ([coordinate, getValue(coordinate)?.toString()] as [CellCoordinates, string | undefined]))
                .filter(([_, value]) => value) as [CellCoordinates, string][]);

            setSelectedItems([...selectedItems, ...itemsToAdd]);
            onMultiCellSelection(newSelectionMap);
        }
    };

    const onCellClick = (coordinates: CellCoordinates) => {
        if (!findSelection(coordinates)) {
            selectItem(coordinates);
        } else {
            deselectItem(coordinates);
        }
    };


    const onExcelUpload = async (newFile?: File) => {
        if (!newFile) {
            return;
        }

        const fileData = await newFile.arrayBuffer();
        const workbook = xlsx.read(fileData);
        setSheet(workbook.Sheets[workbook.SheetNames[1]]);
    };

    if (!data)
        return <FileUpload onUpload={async (files) => onExcelUpload(files?.[0])} />;

    return <div className={styles.container}>
        <table>
            <thead>
                <tr>
                    <td></td>
                    {headers.map((header, column) => <td className={`${styles.cell} ${styles.columnTitle}`}>
                        <button
                            className={cx(
                                styles.cell,
                                styles.columnTitle,
                                styles.button,
                                () => {
                                    const selectionLength = data.map((_, row) => findSelection({ row, column })).filter(a => a).length;
                                    if (selectionLength === data.length) return styles.selected;
                                    if (selectionLength > 0 && selectionLength < data.length) return styles.partiallySelected;
                                }
                            )}
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
                            className={cx(
                                styles.cell,
                                styles.rowTitle,
                                styles.button,
                                () => {
                                    const selectionLength = headers.map((_, column) => findSelection({ row, column })).filter(a => a).length;
                                    if (selectionLength === data.length) return styles.selected;
                                    if (selectionLength > 0 && selectionLength < data.length) return styles.partiallySelected;
                                }
                            )}
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
    </div>
}