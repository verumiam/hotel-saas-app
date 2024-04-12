import { NextResponse, NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { User } from 'next-auth';

const secret = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  const session = await getToken({ req, secret });
  const { pathname } = req.nextUrl;
  const user = session?.user as User;

  // Проверяем наличие сессии пользователя
  if (user) {
    // Редиректим аутентифицированных пользователей с страниц логина/регистрации
    if (pathname.includes('/auth/login') || pathname === '/auth/register') {
      const redirectUrl = user.role === 'admin' ? '/admin' : '/profile';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // Даем доступ к админке только админам, остальных редиректим в профиль
    if (pathname === '/admin' || pathname.startsWith('/admin')) {
      return user.role === 'admin'
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/profile', req.url));
    }
  } else {
    // Редиректим неаутентифицированных пользователей на страницу логина с некоторых URL
    if (['/profile', '/admin'].includes(pathname)) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
  }

  // Для всех остальных случаев просто продолжаем обработку запроса
  return NextResponse.next();
}
