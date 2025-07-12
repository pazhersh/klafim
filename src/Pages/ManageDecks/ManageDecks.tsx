import styles from './ManageDecks.module.css';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';
import { EditDeck } from './EditDeck';
import { useNavigate } from 'react-router';

export default function ManageDecks() {
    const { decks, createDeck } = useDecksStore();
    const navigate = useNavigate();

    const onNewDeck = () => {
        const deckTextualNumbers = Array.from(decks.values())
            .map((deck) => deck.name.match(/^New Deck #(\d*)$/)?.at(1));


        const newDeckNumber = deckTextualNumbers.reduce((max, numberText) => {
            const number = numberText && Number.parseInt(numberText);
            return number && (number > max) ?
                number :
                max;
        }, 0);

        const deckId = createDeck({ name: `New Deck #${newDeckNumber + 1}`, cardValues: [] });
        navigate(`/manage-decks/${deckId}`);
    };

    return <div className={styles.container}>
        <NavBar />

        <h1>Manage Decks</h1>

        <h2>Available Decks:</h2>
        <div className={`${styles.deckList}`}>
            {
                Array.from(decks.entries()).map(([id, deck]) => <EditDeck key={id} id={id} deck={deck} />)
            }
            <button onClick={onNewDeck}>New</button>
        </div>
    </div>
}