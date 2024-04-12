'use client';

import useAuth from '@/helpers/auth/auth-hook';
import { Button, Input, Typography, CircularProgress } from '@mui/material';
import { useSession } from 'next-auth/react';

export default function AdminLogin() {
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
    <div className="h-full mx-auto mt-[120px] w-[400px]">
      <Typography
        className="text-center border-b border-gray-200 pb-2 w-full uppercase"
        variant="subtitle1"
      >
        Вход в админ-панель отеля
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
    </div>
  );
}
