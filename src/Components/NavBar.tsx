import { NavLink } from 'react-router';
import styles from './NavBar.module.css';
import React from 'react';

type Link = {
    to: string;
    label: string;
}

const links: Link[] = [
    { to: '/', label: 'Klafim' },
    { to: '/manage-decks', label: 'Manage Decks' },
    { to: '/table-top?shuffle', label: 'Table-Top' },
    { to: 'https://github.com/pazhersh/klafim/issues/new', label: 'Report a Bug' }
];

function Seperator() {
    return <div className={styles.seperator} />
}

export default function NavBar() {
    return <div className={styles.container}>
        {links.slice(0, length - 1).map(link =>
            <React.Fragment key={link.to}>
                <NavLink key={link.to} className={styles.link} to={link.to}>{link.label}</NavLink>
                <Seperator />
            </React.Fragment>
        )}
        <NavLink className={styles.link} to={links.at(-1)!.to}>{links.at(-1)!.label}</NavLink>
    </div>
}