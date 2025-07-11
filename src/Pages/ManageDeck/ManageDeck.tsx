import { useMemo } from 'react';
import { useParams } from 'react-router';
import EditDeckTitle from '../../Components/EditDeckTitle';
import EditDeckValues from '../../Components/EditDeckValues';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';
import DeckPreview from '../../Components/DeckPreview';
import styles from './ManageDeck.module.css'
import ExcelDeckEditor from '../../Components/ExcelDeckEditor';

export default function ManageDeck() {
    const { deckId } = useParams();
    const { decks, removeDeck } = useDecksStore();

    const deck = useMemo(() => !deckId ? undefined : decks.get(deckId), [decks])

    if (!deckId || !deck) {
        return 'not found'; // TODO: redirect
    }

    const onDelete = () => removeDeck(deckId);

    return <div>
        <NavBar />

        <h1>
            <EditDeckTitle deckId={deckId} allowDelete={false} />
        </h1>

        <EditDeckValues deckId={deckId} deck={deck} />

        <button onClick={onDelete}>delete deck</button>

        <div className={styles.excelContainer}>
            <ExcelDeckEditor />
        </div>

        <div className={styles.previewContainer}>
            <DeckPreview deck={deck} />
        </div>
    </div>
}