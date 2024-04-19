'use client';

import { IUser } from '@/models/user';

export async function getUserList(): Promise<IUser[]> {
  const response = await fetch(`/api/user/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
