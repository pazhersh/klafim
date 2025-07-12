import { useMemo, useState } from "react";
import { CellCoordinates } from "./types";

type CoordinateKey = string;

function getCoordinateKey({ row, column }: CellCoordinates) {
    return `${row}-${column}` as CoordinateKey;
}

export default function useTableSelectionState() {
    const [values, setValues] = useState<Map<CoordinateKey, string>>(new Map());
    const selections = useMemo(() => Array.from(values.values()), [values]);


    const onCellSelection = (value: string, coordinate: CellCoordinates) => {
        setValues(new Map(values).set(getCoordinateKey(coordinate), value));
    };

    const onMultiCellsSelection = (selections: Map<CellCoordinates, string>) => {
        const newValues = new Map(values);
        selections.forEach((value, coordinate) => newValues.set(getCoordinateKey(coordinate), value))
        setValues(newValues);
    };

    const onCellDeselection = (coordinate: CellCoordinates) => {
        const newValues = new Map(values);
        newValues.delete(getCoordinateKey(coordinate))
        setValues(newValues);
    };

    const onMultiCellsDeselection = (coordinates: CellCoordinates[]) => {
        const newValues = new Map(values);
        coordinates.forEach((coordinate) => newValues.delete(getCoordinateKey(coordinate)))
        setValues(newValues);
    };

    return { selections, onCellSelection, onCellDeselection, onMultiCellsSelection, onMultiCellsDeselection };
}