import NavBar from '../../Components/NavBar';
import styles from './HomePage.module.css';

export default function HomePage() {
    return <div>
        <NavBar/>
        <h1>Welcome to Klafim <span className={styles.signature}>by Pazhersh</span></h1>
        <p>The <b>Number One</b> klafim (cards) manager in the country.</p>
        <p>And if it's not the Number One klafim manager in the country it's probably because it's hosted in another countery. And so it's the <b>Number One</b> klafim manager in that country!</p>

        <h2>User Manual</h2>
        <ul>
            <li>To view and play with your decks of cards go to the "Table-Top" tab</li>
            <li>To manage the decks available to play with go to the "Manage Decks" tab</li>
            <li>To report a bug go to the "Report a Bug" tab</li>
        </ul>
    </div>
}