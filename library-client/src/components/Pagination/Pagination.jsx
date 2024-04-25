import styles from './Pagination.module.css';

export const Pagination = ({ postPerPage, totalPost, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalPost / postPerPage); i++) {
        pageNumbers.push(i);
    }

    const onPageItemClick = (pageNumber) => {
        paginate(pageNumber);
    };

    return (
        <nav>
            <ul className={styles.pagination}>
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={[
                            styles.pageItem,
                            currentPage === number && styles.activePage,
                        ].join(' ')}
                        onClick={() => onPageItemClick(number)}
                    >
                        <div className={styles.pageLink}>{number}</div>
                    </li>
                ))}
            </ul>
        </nav>
    );
};
