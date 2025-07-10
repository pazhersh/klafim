import { NavLink } from 'react-router';
import styles from './NavBar.module.css';

export default function NavBar() {
    return <div className={styles.container}>
        <NavLink className={styles.link} to='/manage-decks'>Edit Decks</NavLink>
        {/* <NavLink className={styles.link} to='/upload'>Edit Decks</NavLink> */}
        <NavLink className={styles.link} to='/table-top'>Table-Top</NavLink>
    </div>
}