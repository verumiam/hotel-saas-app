'use client';

import useAuth from '@/helpers/auth/auth-hook';
import { Button, Input, Typography, CircularProgress } from '@mui/material';
import Link from 'next/link';

export default function Register() {
  const { registerData, errors, loading, handleChange, onSubmitData } = useAuth();

  if (loading) {
    return (
      <div className="h-1/2 flex items-center justify-center">
        <CircularProgress color="error" />
      </div>
    );
  }

  return (
    <div className="h-full mx-auto mt-[120px] w-[400px]">
      <Typography
        className="text-center border-b border-gray-200 pb-2 w-full uppercase"
        variant="subtitle1"
      >
        Регистрация личного кабинета
      </Typography>
      <form className="flex flex-col gap-y-4 my-4 w-full">
        <Input
          className="w-full"
          placeholder="Email"
          value={registerData.email}
          onChange={(e) => handleChange(e.currentTarget.value, 'email')}
        />
        {errors.email ? (
          <Typography variant="caption" className="text-red-500">
            {errors.email}
          </Typography>
        ) : null}
        <Input
          className="w-full"
          placeholder="Фамилия"
          value={registerData.lastName}
          onChange={(e) => handleChange(e.currentTarget.value, 'lastName')}
        />
        {errors.lastName ? (
          <Typography variant="caption" className="text-red-500">
            {errors.lastName}
          </Typography>
        ) : null}
        <Input
          className="w-full"
          placeholder="Имя"
          value={registerData.name}
          onChange={(e) => handleChange(e.currentTarget.value, 'name')}
        />
        {errors.name ? (
          <Typography variant="caption" className="text-red-500">
            {errors.name}
          </Typography>
        ) : null}
        <Input
          className="w-full"
          placeholder="Пароль"
          type="password"
          value={registerData.password}
          onChange={(e) => handleChange(e.currentTarget.value, 'password')}
        />
        {errors.password ? (
          <Typography variant="caption" className="text-red-500">
            {errors.password}
          </Typography>
        ) : null}
        {errors.serverError ? (
          <Typography variant="caption" className="text-red-500">
            {errors.serverError}
          </Typography>
        ) : null}
        <Button color="error" variant="contained" onClick={() => onSubmitData('register')}>
          Зарегистрироваться
        </Button>
      </form>
      <Button className="w-full" color="error" variant="text">
        <Link href="/auth/login">У меня есть личный кабинет. Войти</Link>
      </Button>
    </div>
  );
}
