import { useEffect, useState } from 'react';

export const ReadBook = () => {
    const [path, setPath] = useState('');

    useEffect(() => {
        setPath(localStorage.getItem('bookPath'));
        () => {
            setPath('');
            localStorage.removeItem('bookPath');
        };
    }, []);

    return (
        <iframe
            src={`http://localhost:3001/books/${path}`}
            style={{ width: '100%', height: '100vh', border: 'none' }}
        ></iframe>
    );
};
