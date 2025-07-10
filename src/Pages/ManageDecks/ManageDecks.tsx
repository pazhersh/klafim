import styles from './ManageDecks.module.css';
import NavBar from '../../Components/NavBar';
import { useDecks } from '../../useDecks';
import EditableWrapper from '../../Components/EditableWrapper';
import { EditDeck } from './EditDeck';

export default function ManageDecks() {
    const { decks, updateDeck } = useDecks();

    return <div className={styles.container}>
        <NavBar />

        <h1>Manage Decks</h1>

        <h2>Available Decks:</h2>
        <div className={`${styles.deckList}`}>
            {
                Array.from(decks.entries()).map(([id, deck]) => <EditDeck key={id} id={id} deck={deck} />)
            }
        </div>
    </div>
}