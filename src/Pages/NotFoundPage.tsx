import NavBar from "../Components/NavBar";
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
    return <div>
        <NavBar />
        <div className={styles.content}>
            <h1>404 Page not found</h1>
            <p>the page you are looking for was not found ¯\_(ツ)_/¯</p>
        </div>
    </div>
}