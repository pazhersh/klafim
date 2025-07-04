import { useMemo, useState } from 'react';
import TableTop from '../../Components/TableTop';
import { Deck as DeckData, loadDecks } from '../../decksUtils';
import styles from './TableTopPage.module.css';
import NavBar from '../../Components/NavBar';

export default function TableTopPage() {
    const decks = useMemo<DeckData[]>(() => Array.from(loadDecks().values()), []);

    return <div className={styles.container}>
        <div className={styles.overlay}>
            <NavBar />
        </div>
        <TableTop className={styles.canvas} decks={decks} />
    </div>;
}