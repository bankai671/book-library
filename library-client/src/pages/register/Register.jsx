import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { registerValidationSchema } from './registerValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

import { Header, Loader } from '../../components';

import { registerFailure, registerStart, registerSuccess } from '../../store';
import { api } from '../../api';

import styles from './Register.module.css';

export const Register = () => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerValidationSchema),
    });

    const { isAuth, isLoading, error } = useSelector((state) => state.authReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function formSubmitHandler() {
        const { email, password } = getValues();

        dispatch(registerStart());
        try {
            const response = await api.post('/auth/register', {
                email,
                password,
            });
            dispatch(registerSuccess(response.data));
            navigate('/');
        } catch (error) {
            dispatch(registerFailure(error.message));
        }
    }

    useEffect(() => {
        if (isAuth) {
            navigate('/');
        }
    }, [isAuth]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <>
            <Header />
            <div className={styles.container}>
                <div className={styles.title}>Registration</div>
                <form className={styles.form} onSubmit={handleSubmit(formSubmitHandler)}>
                    <div className={styles.inputWrapper}>
                        <input
                            {...register('email')}
                            type='email'
                            placeholder='email'
                            className={styles.input}
                            autoFocus
                            tabIndex={1}
                        />
                        {errors.email && (
                            <p className={styles.errorField}>{errors.email.message}</p>
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <input
                            {...register('password')}
                            type='password'
                            placeholder='password'
                            className={styles.input}
                            tabIndex={2}
                        />
                        {errors.password && (
                            <p className={styles.errorField}>{errors.password.message}</p>
                        )}
                    </div>
                    <div className={styles.inputWrapper}>
                        <input
                            {...register('confirmPassword')}
                            type='password'
                            placeholder='confirm password'
                            className={styles.input}
                            tabIndex={3}
                        />
                        {errors.confirmPassword && (
                            <p className={styles.errorField}>{errors.confirmPassword.message}</p>
                        )}
                    </div>
                    <input type='submit' className={styles.btn} tabIndex={4} value='sign up' />
                </form>
                <Link to='/login' className={styles.loginLink}>
                    I already have account
                </Link>
                {error && <div>{error.message}</div>}
            </div>
        </>
    );
};
