import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { loginValidationSchema } from './loginValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';

import { Header, Loader } from '../../components';

import { loginFailure, loginStart, loginSuccess } from '../../store';
import { api } from '../../api';

import styles from './Login.module.css';

export const Login = () => {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginValidationSchema),
    });
    const { isAuth, user, isLoading } = useSelector((state) => state.authReducer);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function formSubmitHandler() {
        const { email, password } = getValues();

        dispatch(loginStart());
        try {
            const response = await api.post('/auth/login', { email, password });
            dispatch(loginSuccess(response.data));
            navigate('/');
        } catch (error) {
            dispatch(loginFailure(error.message));
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
                <div className={styles.title}>Login</div>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit(formSubmitHandler)}
                >
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
                            <p className={styles.errorField}>
                                {errors.email.message}
                            </p>
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
                            <p className={styles.errorField}>
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <input
                        type='submit'
                        className={styles.btn}
                        tabIndex={3}
                        value='sign in'
                    />
                </form>
                <Link to='/register' className={styles.loginLink}>
                    I don&apos;t have account
                </Link>
            </div>
        </>
    );
};
