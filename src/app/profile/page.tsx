'use client';

import { getBookingList } from '@/network/booking/getBookingList';
import { Button, Container, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Profile() {
  const { data: session } = useSession();
  const [bookingData, setBookingData] = useState([]);

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: session?.user.role === 'admin' ? '/admin/auth/login' : '/auth/login',
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!session?.user.id) return;
        const data = await getBookingList(session?.user.id);
        setBookingData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookings();
  }, [session?.user]);

  return (
    <Container className="mt-[60px]">
      <div className="flex justify-between">
        <Typography variant="h5">Личные сведения</Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Выйти
        </Button>
      </div>
      <ul className="mb-8">
        <li>Имя: {session?.user?.name}</li>
        <li>Фамилия: {session?.user?.lastName}</li>
        <li>E-mail: {session?.user?.email}</li>
      </ul>
      <Typography variant="h5">Арендованные номера</Typography>
      <span>Вы пока не арендовали ни одного номера</span>
    </Container>
  );
}
