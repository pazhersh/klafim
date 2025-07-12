import { useMemo } from 'react';
import { useParams } from 'react-router';
import EditDeckTitle from '../../Components/EditDeckTitle';
import EditDeckValues, { useEditDeckValues } from '../../Components/EditDeckValues';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';
import DeckPreview from '../../Components/DeckPreview';
import styles from './ManageDeck.module.css'
import ExcelEditor from '../../Components/ExcelEditor/ExcelEditor';
import useTableSelectionState from '../../Components/ExcelEditor/useTableSelectionState';
import EditableWrapper from '../../Components/Inputs/EditableWrapper';
import Creatable from '../../Components/Inputs/Creatable';

export default function ManageDeck() {
    const { deckId } = useParams();
    const { decks, removeDeck, updateDeck } = useDecksStore();

    const {
        selections: tableSelection,
        onCellSelection,
        onCellDeselection,
        onMultiCellsDeselection,
        onMultiCellsSelection,
        resetSelection
    } = useTableSelectionState();


    const deck = useMemo(() => !deckId ? undefined : decks.get(deckId), [decks])

    const { onCreateCard, onDeleteValue, onEditValue } = useEditDeckValues({ deckId, deck });

    if (!deckId || !deck) {
        return 'not found'; // TODO: redirect
    }

    const onDelete = () => removeDeck(deckId);

    const onSaveTableCards = () => {
        updateDeck(deckId, {
            ...deck,
            cardValues: [...deck.cardValues, ...tableSelection]
        });
        resetSelection()
    };

    return <div>
        <NavBar />

        <h1>
            <EditDeckTitle deckId={deckId} allowDelete={false} />
        </h1>

        <h2> cards </h2>

        <ul className={styles.cardsList}>
            <li><Creatable onCreate={onCreateCard} /></li>
            {deck.cardValues.map((value, index) => <li key={`${index}${value}`}>
                <EditableWrapper
                    value={value}
                    onEdit={(newValue) => onEditValue(index, newValue)}
                    onDelete={() => onDeleteValue(index)}
                />
            </li>)}

            {!tableSelection.length ? null :
                <>
                    <li>
                        <button className={styles.tableSelection} onClick={onSaveTableCards}>Save cards</button>
                    </li>
                    {tableSelection.map(value => <li key={value} className={styles.tableSelection}>{value}</li>)}
                    <li>
                        <button className={styles.tableSelection} onClick={onSaveTableCards}>Save cards</button>
                    </li>
                </>
            }
        </ul>


        <button onClick={onDelete}>delete deck</button>

        <div className={styles.excelContainer}>
            <ExcelEditor
                onCellSelection={onCellSelection}
                onMultiCellSelection={onMultiCellsSelection}
                onCellDeselection={onCellDeselection}
                onMultiCellDeselection={onMultiCellsDeselection}
            />
        </div>

        <div className={styles.previewContainer}>
            <DeckPreview deck={deck} />
        </div>
    </div>
}