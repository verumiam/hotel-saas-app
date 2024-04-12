'use client';

import { ReactNode, useState } from 'react';
import { loginEmail } from '@/helpers/auth/email-login';
import { registerEmail } from '@/helpers/auth/email-register';
import { isValidEmail, isValidPassword } from '@/helpers/validators';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

const useAuth = () => {
  const [registerData, setRegisterData] = useState({
    email: '',
    lastName: '',
    name: '',
    password: '',
  });

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, ReactNode>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = (authType: 'register' | 'login') => {
    let isValid = true;
    let errors = {} as Record<string, ReactNode>;

    if (authType === 'register') {
      if (!isValidEmail(registerData.email)) {
        isValid = false;
        errors.email = 'Некорректный email';
      }
      if (!isValidPassword(registerData.password)) {
        isValid = false;
        errors.password =
          'Пароль должен быть длиннее 6 символов, содержать как минимум одну заглавную букву, одну цифру и один специальный символ (!@#$%^&)';
      }
      if (!registerData.lastName || registerData.lastName.length <= 3) {
        isValid = false;
        errors.lastName = 'Вы не ввели фамилию';
      }
      if (!registerData.name) {
        isValid = false;
        errors.name = 'Вы не ввели имя';
      }
    }

    if (authType === 'login') {
      if (!isValidEmail(loginData.email)) {
        isValid = false;
        errors.email = 'Некорректный email';
      }
      if (!isValidPassword(loginData.password)) {
        isValid = false;
        errors.password =
          'Пароль должен быть длиннее 6 символов, содержать как минимум одну заглавную букву, одну цифру и один специальный символ (!@#$%^&)';
      }
    }

    setErrors(errors);
    return isValid;
  };

  const handleChange = (
    value: string,
    fieldName: string,
    authType: 'register' | 'login' = 'register'
  ) => {
    if (errors[fieldName]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: null,
      }));
    }

    if (authType === 'register') {
      setRegisterData((prevState) => ({ ...prevState, [fieldName]: value }));
    } else {
      setLoginData((prevState) => ({ ...prevState, [fieldName]: value }));
    }
  };

  const onSubmitData = async (authType: 'register' | 'login') => {
    if (!validate(authType)) return;

    setLoading(true);

    if (authType === 'register') {
      try {
        const response = await registerEmail(registerData);

        if (response.status === 400) {
          setErrors({
            serverError:
              'Данный Email-адрес уже занят. Войдите, или воспользуйтесь другим Email-адресом',
          });
        }

        if (response.status === 200) {
          console.log('User registered successfully');
          let data = { email: registerData.email, password: registerData.password };
          await loginEmail(data);
          router.replace('/profile');
        }
      } catch (error: any) {
        console.error('Error during registration', error);
        setErrors({ serverError: error.message });
      }
    }

    if (authType === 'login') {
      try {
        const response = await loginEmail(loginData);

        if (response?.status === 401) {
          setErrors({ serverError: 'Неправильный логин или пароль' });
        }

        const session = await getSession();
        const isAdmin = session?.user.role === 'admin';

        if (response?.ok && session) {
          console.log('User logged in successfully');
          router.replace(isAdmin ? '/admin' : '/profile');
        }
      } catch (error) {
        console.error('Error during login', error);
      }
    }

    setLoading(false);
    setLoginData({ email: '', password: '' });
    setRegisterData({ email: '', lastName: '', name: '', password: '' });
  };

  return {
    registerData,
    setRegisterData,
    loginData,
    setLoginData,
    errors,
    setErrors,
    loading,
    setLoading,
    validate,
    handleChange,
    onSubmitData,
  };
};

export default useAuth;
