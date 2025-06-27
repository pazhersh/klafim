import { create } from 'zustand';

type TableCoords = [number, number];

type TableSelection = {
    coords: TableCoords,
    value: string,
};

type TableSelectionStore = {
    selections: Map<string, TableSelection>,
    setSelections: (selections: TableSelection[]) => void,
    addSelection: (selection: TableSelection) => void;
    removeSelection: (selectionCoords: TableCoords) => void;
}

export default create<TableSelectionStore>((set) => ({
    selections: new Map<string, TableSelection>(),
    setSelections: (selections: TableSelection[]) => set({
        selections: new Map(selections.map(
            selection => ([JSON.stringify(selection.coords), selection])
        ))
    }),
    addSelection: (newSelection: TableSelection) => set((store) => ({
        selections: new Map(store.selections).set(JSON.stringify(newSelection.coords), newSelection)
    })
    ),
    removeSelection: (coords: TableCoords) => set((store) => {
        const selections = new Map(store.selections);
        selections.delete(JSON.stringify(coords));
        return { selections };
    }),
}))