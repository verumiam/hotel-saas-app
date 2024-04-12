'use client';

import { signIn } from 'next-auth/react';

type LoginData = {
  email: string;
  password: string;
};

export const loginEmail = async ({ email, password }: LoginData) => {
  const response = await signIn('credentials', {
    redirect: false,
    email,
    password,
  });

  return response;
};
