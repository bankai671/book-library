import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { bookCreateValidationSchema } from './bookCreateValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

import { Header, Loader } from '../../components';

import { api } from '../../api';

import styles from './Dashboard.module.css';

export const Dashboard = () => {
    const [isLoading, setIsLoading] = useState();
    const [selectedImageFile, setSelectedImageFile] = useState(null);
    const [selectedBookFile, setSelectedBookFile] = useState(null);

    const {
        register,
        handleSubmit,
        getValues,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(bookCreateValidationSchema),
    });

    const formSubmitHandler = async () => {
        setIsLoading(true);
        const formValues = getValues();

        try {
            const formData = new FormData();

            if (selectedImageFile) {
                formData.append('imageFile', selectedImageFile);
                formData.append('imagePath', selectedImageFile.name);
            }
            if (selectedBookFile) {
                formData.append('bookFile', selectedBookFile);
                formData.append('bookPath', selectedBookFile.name);
            }

            Object.keys(formValues).forEach((key) => {
                formData.append(key, formValues[key]);
            });

            const response = await api.post('/book/create/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setSelectedBookFile(null);
            setSelectedImageFile(null);
            console.log(response);
        } catch (error) {
            console.error('Error uploading file:', error);
        }

        reset();
        setIsLoading(false);
    };

    const imageFileChangeHandler = (event) => {
        const file = event.target.files[0];
        setSelectedImageFile(file);
    };

    const bookFileChangeHandler = (event) => {
        const file = event.target.files[0];
        setSelectedBookFile(file);
    };

    useEffect(() => {
        console.log(selectedBookFile);
        console.log(selectedImageFile);
        console.log(getValues());
    }, [selectedBookFile, selectedImageFile]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <form className={styles.form} onSubmit={handleSubmit(formSubmitHandler)}>
                    <div className={styles.imageInputWrapper}>
                        <input
                            type='file'
                            multiple={false}
                            accept='image/*'
                            onChange={imageFileChangeHandler}
                            className={styles.fileInput}
                            name='imageFile'
                        />
                        <p>Image uploader</p>
                    </div>
                    <div className={styles.bookInputWrapper}>
                        <input
                            type='file'
                            multiple={false}
                            accept='.doc,.docx,.pdf'
                            onChange={bookFileChangeHandler}
                            className={styles.fileInput}
                            name='bookFile'
                        />
                        <p>Book uploader</p>
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('title')}
                                type='text'
                                placeholder='Book title'
                                className={styles.input}
                                autoFocus
                                tabIndex={1}
                            />
                            {errors.title?.message && (
                                <p className={styles.errorField}>{errors.title.message}</p>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('author')}
                                type='text'
                                placeholder='Book author'
                                className={styles.input}
                                tabIndex={2}
                            />
                            {errors.author?.message && (
                                <p className={styles.errorField}>{errors.author.message}</p>
                            )}
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('genre')}
                                type='text'
                                placeholder='Book genre'
                                className={styles.input}
                                tabIndex={3}
                            />
                            {errors.genre?.message && (
                                <p className={styles.errorField}>{errors.genre.message}</p>
                            )}
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                {...register('publishingYear')}
                                type='text'
                                placeholder='Book publishing year'
                                className={styles.input}
                                tabIndex={3}
                            />
                            {errors.publishingYear?.message && (
                                <p className={styles.errorField}>
                                    {errors.publishingYear.message.split(' ').slice(0, 5).join(' ')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.inputWrapper}>
                        <textarea
                            {...register('description')}
                            type=''
                            placeholder='Book description'
                            className={[styles.textarea, styles.input].join(' ')}
                            tabIndex={3}
                        />
                        {errors.description?.message && (
                            <p className={styles.errorField}>{errors.description.message}</p>
                        )}
                    </div>
                    <input type='submit' className={styles.btn} tabIndex={4} value='Create Book' />
                </form>
            </div>
        </>
    );
};
