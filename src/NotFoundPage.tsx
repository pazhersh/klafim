import { NavLink } from "react-router";

export default function NotFoundPage() {
    return <ul>
        <li><NavLink to='/upload'>upload</NavLink></li>
        <li><NavLink to='/table-top'>table-top</NavLink></li>
    </ul>
}