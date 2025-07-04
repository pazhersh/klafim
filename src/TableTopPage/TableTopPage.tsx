import { useMemo } from 'react';
import TableTop from '../ElementComponents/TableTop';
import styles from './TableTopPage.module.css';

export default function TableTopPage() {

    const deck = useMemo(() => ({ name: 'test', cardValues: ['1', '2', '3'] }), []);

    return <div className={styles.container}>
        <button className={styles.nonCanvas}>test</button>
        <TableTop className={styles.canvas} decks={[deck]} />
    </div>;
}