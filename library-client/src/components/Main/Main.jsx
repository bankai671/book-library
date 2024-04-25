import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { searchValidationSchema } from './searchValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

import { BooksList, Loader, Pagination } from '../';

import { api } from '../../api';

import styles from './Main.module.css';

export const Main = () => {
    const [fetchedBooks, setFetchedBooks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSearched, setIsSearched] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [selected, setSelected] = useState('Not selected');
    const { register, handleSubmit, getValues, reset } = useForm({
        resolver: yupResolver(searchValidationSchema),
    });

    const postPerPage = 12;
    const indexOfLastPost = currentPage * postPerPage;
    const indexOfFirstPost = indexOfLastPost - postPerPage;
    const currentPosts = fetchedBooks.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (number) => {
        setCurrentPage(number);
    };

    const fetchBooks = async () => {
        setIsLoading(true);
        const response = await api.get('/book/all');
        setFetchedBooks(response.data || []);
        setCurrentPage(1);
        setIsLoading(false);
    };

    const formSubmitHandler = async () => {
        setIsLoading(true);
        const { searchQuery } = getValues();
        const response = await api.get(`/book/search?query=${searchQuery}`);
        setFetchedBooks(response.data || []);
        setCurrentPage(1);
        setIsSearched(true);
        reset();
        setIsLoading(false);
    };

    const onGetAllBooksClick = async () => {
        setIsLoading(true);
        fetchBooks();
        setIsSearched(false);
        setCurrentPage(1);
        setIsLoading(false);
    };

    const onSelectChange = (event) => {
        setSelected(event.target.value);
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <main className={styles.main}>
            <div className={styles.container}>
                <div className={styles.books}>
                    <form className={styles.actions} onSubmit={handleSubmit(formSubmitHandler)}>
                        <input
                            {...register('searchQuery')}
                            type='text'
                            placeholder='Search book!'
                            className={styles.input}
                        />
                        <input type='submit' className={styles.btn} value='Search' />
                        <button className={styles.btn} onClick={onGetAllBooksClick}>
                            Get all books
                        </button>
                        <select
                            onChange={onSelectChange}
                            value={selected}
                            className={styles.select}
                        >
                            <option value='1'>Filter by title</option>
                            <option value='2'>Filter A-Z</option>
                            <option value='3'>Filter Z-A</option>
                        </select>
                    </form>
                    {fetchedBooks.length ? (
                        <BooksList books={currentPosts} />
                    ) : (
                        <div>
                            {isSearched
                                ? 'There are no books by your search query :('
                                : 'There are no books in your library yet :('}
                        </div>
                    )}
                </div>
                <Pagination
                    postPerPage={postPerPage}
                    totalPost={fetchedBooks.length}
                    paginate={paginate}
                    currentPage={currentPage}
                />
            </div>
        </main>
    );
};
