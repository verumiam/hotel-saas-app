'use client';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';

export const AuthProvider = ({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session;
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>;
};

export default AuthProvider;
