import styles from './ManageDecks.module.css';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';
import { EditDeck } from './EditDeck';
import Creatable from '../../Components/Inputs/Creatable';
import { NavLink } from 'react-router';

export default function ManageDecks() {
    const { decks, createDeck } = useDecksStore();

    return <div className={styles.container}>
        <NavBar />

        <h1>Manage Decks</h1>

        <h2>Available Decks:</h2>
        <div className={`${styles.deckList}`}>
            {
                Array.from(decks.entries()).map(([id, deck]) => <EditDeck key={id} id={id} deck={deck} />)
            }
            <Creatable defaultValue={`Deck #${decks.size}`} onCreate={(deckName) => createDeck({ name: deckName, cardValues: [] })} />
        </div>

        <NavLink className={styles.link} to='/upload'>Upload excel file</NavLink>
    </div>
}