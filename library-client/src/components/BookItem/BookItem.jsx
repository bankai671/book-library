import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Loader } from '../';

import { api } from '../../api';

import styles from './BookItem.module.css';

export const BookItem = () => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentBook, setCurrentBook] = useState({});
    const { id: bookId } = useParams();
    const { user } = useSelector((state) => state.authReducer);

    const navigate = useNavigate();

    const onRemoveFromFavouritesClick = async () => {
        setIsLoading(true);
        await api.delete(`/user/${user._id}/books/${currentBook._id}`);
        setIsFavourite(false);
        setIsLoading(false);
    };

    const onAddToFavouritesClick = async () => {
        setIsLoading(true);
        await api.post(`/user/${user._id}/books/${currentBook._id}`);
        setIsFavourite(true);
        setIsLoading(false);
    };

    const onDeleteBookClick = async () => {
        setIsLoading(true);
        await api.delete(`/book/${currentBook._id}`);
        navigate('/');
        setIsLoading(false);
    };

    const fetchBook = async () => {
        setIsLoading(true);
        const response = await api.get(`/book/${bookId}`);
        if (!response.data) {
            navigate('/');
        }
        setCurrentBook(response.data);
        setIsLoading(false);
    };

    const checkIsBookFavourite = async () => {
        setIsLoading(true);
        const response = await api.get(`/user/${user._id}/books/${bookId}`);
        if (response.data) {
            setIsFavourite(true);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        if (user) {
            checkIsBookFavourite();
        }
    }, [user]);

    useEffect(() => {
        if (currentBook) {
            localStorage.setItem('bookPath', currentBook.bookPath);
        }
    }, [currentBook]);

    useEffect(() => {
        fetchBook();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.bookWrapper}>
                    <div className={styles.bookItem}>
                        <div className={styles.imageWrapper}>
                            <img
                                className={styles.image}
                                style={{ backgroundColor: currentBook?.color }}
                                src={
                                    Boolean(currentBook?.imagePath)
                                        ? `http://localhost:3001/images/${currentBook?.imagePath}`
                                        : '/images/image-placeholder.jpg'
                                }
                                alt={currentBook?.title}
                            />
                        </div>
                        <div className={styles.actions}>
                            {user && isFavourite && (
                                <button
                                    className={[styles.btn, styles.removeFrom].join(' ')}
                                    onClick={onRemoveFromFavouritesClick}
                                >
                                    Remove from favourites
                                </button>
                            )}
                            {user && !isFavourite && (
                                <button
                                    className={[styles.btn, styles.addTo].join(' ')}
                                    onClick={onAddToFavouritesClick}
                                >
                                    Add to favourites
                                </button>
                            )}
                            {user?.role === 'admin' && (
                                <button className={styles.btn} onClick={onDeleteBookClick}>
                                    Delete book
                                </button>
                            )}
                            {currentBook?.bookPath && (
                                <Link to='/read-book' target='_blank' className={styles.btn}>
                                    Open
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className={styles.about}>
                        <div className={styles.info}>
                            <p>Book title:</p>
                            <p>{currentBook?.title}</p>
                        </div>
                        <div className={styles.info}>
                            <p>Book author:</p>
                            <p>{currentBook?.author}</p>
                        </div>
                        <div className={styles.info}>
                            <p>Book publishing year:</p>
                            <p>{currentBook?.publishingYear}</p>
                        </div>
                        <div className={styles.info}>
                            <p>Book genre:</p>
                            <p>{currentBook?.genre}</p>
                        </div>
                        <div className={styles.info}>
                            <p>Book description:</p>
                            <p className={styles.description}>{currentBook?.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
