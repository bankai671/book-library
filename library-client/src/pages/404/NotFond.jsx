import { Link } from 'react-router-dom';

import styles from './NotFound.module.css';

export const NotFond = () => {
    return (
        <div className={styles.main}>
            <h2>404 Page is Not Fond :(</h2>
            <Link to='/' className={styles.link}>
                Go home
            </Link>
        </div>
    );
};
