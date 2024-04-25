import * as yup from 'yup';

export const registerValidationSchema = yup.object().shape({
  email: yup.string().email('enter correct email').required('required field'),
  password: yup.string().min(6, 'enter at least 6 characters').required('required field'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'passwords must match'),
});
