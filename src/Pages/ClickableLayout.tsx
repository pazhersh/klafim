import { Outlet } from 'react-router';
import styles from './ClickableLayout.module.css';

export default function Layout() {
    return <div className={styles.clickable}>
        <Outlet />
    </div>;
}