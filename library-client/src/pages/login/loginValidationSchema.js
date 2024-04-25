import * as yup from 'yup';

export const loginValidationSchema = yup.object().shape({
  email: yup.string().email('enter correct email').required('required field'),
  password: yup.string().min(6, 'enter at least 6 characters').required('required field'),
});