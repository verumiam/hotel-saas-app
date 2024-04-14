'use client';

import { Container } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function Header() {
  const session = useSession();

  return (
    <header className="py-4">
      <Container>
        <nav className="flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" width={90} height={59} alt="Мариотт Отель Краснодар" priority />
          </Link>
          <ul className="flex items-center gap-x-16">
            <li>
              <Link href="/">Об отеле</Link>
            </li>
            <li>
              <Link href="/rooms">Номера</Link>
            </li>
            <li>
              <Link href="/special-offers">Спецпредложения</Link>
            </li>
          </ul>
          <div className="flex gap-x-4">
            {session?.data?.user?.role === 'admin' ? (
              <Link className="bg-red-700 text-white py-1 px-5 rounded-lg" href="/admin">
                Админ-панель
              </Link>
            ) : null}
            {session?.data?.user ? (
              <Link className="bg-red-700 text-white py-1 px-5 rounded-lg" href="/profile">
                Профиль
              </Link>
            ) : (
              <Link className="bg-red-700 text-white py-1 px-5 rounded-lg" href="/auth/login">
                Войти
              </Link>
            )}
          </div>
        </nav>
      </Container>
    </header>
  );
}
