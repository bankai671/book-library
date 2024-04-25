import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../store';

import styles from './Header.module.css';

export const Header = () => {
    const { isAuth, user } = useSelector((state) => state.authReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onLogoClick = () => {
        navigate('/');
    };

    const onFavouritesClick = () => {
        navigate('/favourites');
    };

    const onDashboardClick = () => {
        navigate('/dashboard');
    };

    const onLoginClick = () => {
        navigate('/login');
    };

    const onLogoutClick = () => {
        dispatch(logout());
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo} onClick={onLogoClick}>
                    Library
                </div>
                <div className={styles.actions}>
                    {isAuth && user?.role === 'admin' && (
                        <button className={styles.btn} onClick={onDashboardClick}>
                            Dashboard
                        </button>
                    )}
                    <button className={styles.btn} onClick={onFavouritesClick}>
                        Favourites
                    </button>
                    {isAuth ? (
                        <button className={styles.btn} onClick={onLogoutClick}>
                            Logout
                        </button>
                    ) : (
                        <button className={styles.btn} onClick={onLoginClick}>
                            Login
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
};
