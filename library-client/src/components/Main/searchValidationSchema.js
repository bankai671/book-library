import * as yup from 'yup';

export const searchValidationSchema = yup.object().shape({
    searchQuery: yup.string().trim().required('search query can not be empty!'),
});
