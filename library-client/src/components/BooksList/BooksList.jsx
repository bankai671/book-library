import { Link } from 'react-router-dom';

import { generateRandomColor } from '../../utils';

import styles from './BooksList.module.css';

export const BooksList = (props) => {
    return (
        <div className={styles.items}>
            {props.books.map((book) => {
                return (
                    <Link
                        to={`/book/${book._id}`}
                        className={styles.item}
                        key={book._id}
                        style={{ backgroundColor: generateRandomColor() }}
                    >
                        <img
                            className={styles.img}
                            src={
                                Boolean(book?.imagePath)
                                    ? `http://localhost:3001/images/${book.imagePath}`
                                    : '/images/image-placeholder.jpg'
                            }
                            alt={book.title}
                        />
                        <div className={styles.info}>
                            <div className={styles.bookName}>{book.title}</div>
                        </div>
                        <div className={styles.year}>{book.piblishingYear}</div>
                    </Link>
                );
            })}
        </div>
    );
};
