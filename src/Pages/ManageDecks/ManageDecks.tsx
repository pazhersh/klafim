import styles from './ManageDecks.module.css';
import NavBar from '../../Components/NavBar';
import { useDecks } from '../../useDecks';

export default function ManageDecks() {
    const { decks } = useDecks();

    return <div className={styles.container}>
        <NavBar />

        <h1>Manage Decks</h1>

        <h2>Available Decks:</h2>
        <div className={`${styles.deckList}`}>
            {
                Array.from(decks.entries()).map(([id, deck]) => <div key={id} className={styles.deck}>
                    <h3>
                        {deck.name}
                    </h3>
                    <ul>
                        {deck.cardValues.map((value) => <li key={value}>{value}</li>)}
                    </ul>
                </div>)
            }
        </div>
    </div>
}