import { NavLink } from 'react-router';
import styles from './NavBar.module.css';
import React from 'react';

type Link = {
    to: string;
    label: string;
}

const links: Link[] = [
    { to: '/', label: 'klafim' },
    { to: '/manage-decks', label: 'Edit Decks' },
    { to: '/table-top', label: 'Table-Top' },
    { to: 'https://github.com/pazhersh/klafim/issues/new', label: 'Report a bug' }
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