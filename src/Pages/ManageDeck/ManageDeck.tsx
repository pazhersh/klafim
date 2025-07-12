import { useMemo } from 'react';
import { useParams } from 'react-router';
import EditDeckTitle from '../../Components/EditDeckTitle';
import EditDeckValues from '../../Components/EditDeckValues';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';
import DeckPreview from '../../Components/DeckPreview';
import styles from './ManageDeck.module.css'
import ExcelEditor from '../../Components/ExcelEditor/ExcelEditor';
import useTableSelectionState from '../../Components/ExcelEditor/useTableSelectionState';

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
        <EditDeckValues deckId={deckId} deck={deck} />


        {!tableSelection.length ? null :
            <div className={styles.tableSelection}>
                <ul className={styles.tableSelection}>
                    {tableSelection.map(value => <li key={value}>{value}</li>)}
                </ul>
                <button onClick={onSaveTableCards}>Save cards</button>
            </div>
        }

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