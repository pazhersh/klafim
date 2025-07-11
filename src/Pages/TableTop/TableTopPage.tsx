import { useMemo } from 'react';
import TableTop from '../../Components/TableTop';
import styles from './TableTopPage.module.css';
import NavBar from '../../Components/NavBar';
import useDecksStore from '../../useDecksStore';

export default function TableTopPage() {
    const { decks } = useDecksStore()
    const deckValues = useMemo(() => Array.from(decks.values()), [decks])

    return <div className={styles.container}>
        <div className={styles.overlay}>
            <NavBar />
        </div>
        <TableTop className={styles.canvas} decks={deckValues} />
    </div>;
}