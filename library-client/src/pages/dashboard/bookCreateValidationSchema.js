import * as yup from 'yup';

export const bookCreateValidationSchema = yup.object().shape({
    title: yup.string().required('required field'),
    author: yup.string().required('required field'),
    genre: yup.string().required('required field'),
    publishingYear: yup.number().positive().integer().required('required field'),
    description: yup.string().required('required field'),
});
