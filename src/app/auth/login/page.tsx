'use client';

import useAuth from '@/helpers/auth/auth-hook';
import { Button, Input, Typography, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
  const { loginData, errors, loading, handleChange, onSubmitData } = useAuth();
  const { data: session, status } = useSession();

  if (loading || status === 'loading') {
    return (
      <div className="h-1/2 flex items-center justify-center">
        <CircularProgress color="error" />
      </div>
    );
  }

  return (
    status !== 'authenticated' && (
      <div className="h-full mx-auto mt-[120px] w-[400px]">
        <Typography
          className="text-center border-b border-gray-200 pb-2 w-full uppercase"
          variant="subtitle1"
        >
          Вход в личный кабинет
        </Typography>
        <form className="flex flex-col gap-y-4 my-4 w-full">
          <Input
            className="w-full"
            placeholder="Email"
            value={loginData.email}
            onChange={(e) => handleChange(e.currentTarget.value, 'email', 'login')}
          />
          {errors.email ? (
            <Typography variant="caption" className="text-red-500">
              {errors.email}
            </Typography>
          ) : null}
          <Input
            className="w-full"
            placeholder="Пароль"
            type="password"
            value={loginData.password}
            onChange={(e) => handleChange(e.currentTarget.value, 'password', 'login')}
          />
          {errors.password ? (
            <Typography variant="caption" className="text-red-500">
              {errors.password}
            </Typography>
          ) : null}
          <Button color="error" variant="contained" onClick={() => onSubmitData('login')}>
            Войти
          </Button>
        </form>
        <Button className="w-full" color="error" variant="text">
          <Link href="/auth/register">Нет личного кабинета. Зарегистрировать</Link>
        </Button>
      </div>
    )
  );
}
