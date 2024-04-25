import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import { yupResolver } from '@hookform/resolvers/yup';
import { searchValidationSchema } from '../../components/Main/searchValidationSchema';

import { BooksList, Header, Loader, Pagination } from '../../components';

import { api } from '../../api';

import styles from './Favourites.module.css';

export const Favourites = () => {
    const { register, handleSubmit, getValues, reset } = useForm({
        resolver: yupResolver(searchValidationSchema),
    });
    const navigate = useNavigate();
    const { isAuth, user } = useSelector((state) => state.authReducer);

    const [currentPage, setCurrentPage] = useState(1);
    const [fetchedFavouriteBooks, setFetchedFavouriteBooks] = useState([]);
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const postPerPage = 12;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = fetchedFavouriteBooks.slice(indexOfFirstPost, indexOfLastPost);
    const paginate = (number) => {
        setCurrentPage(number);
    };

    const fetchFavouriteBooks = async () => {
        setIsLoading(true);
        const response = await api.get(`/user/${user._id}/books`);
        setFetchedFavouriteBooks(response.data);
        setCurrentPage(1);
        setIsLoading(false);
    };

    const formSubmitHandler = async () => {
        setIsLoading(true);
        const { searchQuery } = getValues();
        const response = await api.get(`/user/${user._id}/search?query=${searchQuery}`);
        setFetchedFavouriteBooks(response.data || []);
        setCurrentPage(1);
        setIsSearched(true);
        reset();
        setIsLoading(false);
    };

    const onGetAllFavouriteBooksClick = async () => {
        fetchFavouriteBooks();
        setIsSearched(false);
    };

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }
        if (user) {
            fetchFavouriteBooks();
        }
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className={styles.favourites}>
            <Header />
            <div className={styles.container}>
                <div className={styles.books}>
                    <form className={styles.form} onSubmit={handleSubmit(formSubmitHandler)}>
                        <div className={styles.actions}>
                            <input
                                {...register('searchQuery')}
                                type='text'
                                placeholder='Search book!'
                                className={styles.input}
                            />
                            <input type='submit' className={styles.btn} value='Search' />
                            <button className={styles.btn} onClick={onGetAllFavouriteBooksClick}>
                                Get all favourite books
                            </button>
                        </div>
                        <h2>favourites</h2>
                    </form>
                    {fetchedFavouriteBooks.length ? (
                        <BooksList books={currentPosts} />
                    ) : (
                        <div>
                            {isSearched
                                ? 'There are no favourite books by your search query :('
                                : 'There are no books in your favourites yet :('}
                        </div>
                    )}
                </div>
                <Pagination
                    postPerPage={postPerPage}
                    totalPost={fetchedFavouriteBooks.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </div>
    );
};
