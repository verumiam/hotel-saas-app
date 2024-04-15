'use client';

import Spinner from '@/components/shared/spinner/spinner';
import { IBooking } from '@/models/booking';
import { IRoom } from '@/models/room';
import cancelBooking from '@/network/booking/cancelBooking';
import { getBookingList } from '@/network/booking/getBookingList';
import { getRoom, updateRoom } from '@/network/rooms';
import {
  Button,
  Checkbox,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  RowSelectionState,
  useReactTable,
} from '@tanstack/react-table';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';

interface IEnrichedBooking extends Partial<IBooking> {
  roomDetails?: IRoom;
}

export default function Profile() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<IEnrichedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingsAndRooms = async () => {
      if (session?.user?.id) {
        try {
          setLoading(true);
          const bookingsData = await getBookingList(session.user.id);
          const roomsDataPromises = bookingsData.map((booking) =>
            getRoom(booking?.roomId).catch((error) => {
              console.error(`Error fetching room ${booking.roomId}:`, error);
              return null;
            })
          );
          const roomsData = await Promise.all(roomsDataPromises);

          const enrichedBookings = bookingsData.map((booking, index) => {
            const roomDetails = roomsData[index];
            return {
              ...booking,
              roomDetails: roomDetails || undefined,
            };
          });

          setBookings(enrichedBookings);
        } catch (error) {
          console.error('Error fetching bookings and rooms:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchBookingsAndRooms();
  }, [session?.user?.id]);

  const handleLogout = async () => {
    await signOut({
      redirect: true,
      callbackUrl: session?.user.role === 'admin' ? '/admin/auth/login' : '/auth/login',
    });
  };

  const columns = useMemo(
    () => [
      {
        id: 'selection',
        header: ({ table }: { table: any }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
        ),
        size: 45,
      },
      { accessorKey: '_id', header: 'ID бронирования' },
      { accessorKey: 'roomDetails.roomNumber', header: 'Номер комнаты' },
      { accessorKey: 'roomDetails.roomType', header: 'Тип комнаты' },
      { accessorKey: 'roomDetails.price', header: 'Цена' },
      { accessorKey: 'roomDetails.capacity', header: 'Вместимость' },
      {
        accessorKey: 'roomDetails.amenities',
        header: 'Удобства',
        cell: (info: any) => info?.getValue()?.join(', ') || 'Нет данных',
      },
      { accessorKey: 'roomDetails.singleBeds', header: 'Односпальные кровати' },
      { accessorKey: 'roomDetails.doubleBeds', header: 'Двуспальные кровати' },
      { accessorKey: 'roomDetails.sofas', header: 'Диваны' },
      { accessorKey: 'roomDetails.numberOfRooms', header: 'Количество комнат' },
      {
        accessorKey: 'checkInDate',
        header: 'Дата заезда',
        cell: (info: any) => new Date(info?.getValue()).toLocaleDateString(),
      },
      {
        accessorKey: 'checkOutDate',
        header: 'Дата выезда',
        cell: (info: any) => new Date(info.getValue()).toLocaleDateString(),
      },
      { accessorKey: 'totalPrice', header: 'Общая цена' },
    ],
    []
  );

  const tableInstance = useReactTable({
    data: bookings,
    state: {
      rowSelection,
    },
    getRowId: (row: any) => row._id,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
  });

  const handleCancelBooking = async () => {
    const selectedBookingIds = Object.keys(rowSelection).filter((id) => rowSelection[id]);

    const roomIdsToUpdate = selectedBookingIds
      .map((bookingId) => {
        const booking = bookings.find((booking) => booking._id === bookingId);
        return booking ? booking.roomId : null;
      })
      .filter((roomId) => roomId !== null);

    try {
      setLoading(true);
      await Promise.all([
        ...selectedBookingIds.map((id) => cancelBooking(id)),
        ...roomIdsToUpdate.map((roomId) =>
          updateRoom({ isAvailable: true, occupants: [] }, roomId as string)
        ),
      ]);
    } catch (error) {
      console.error('Ошибка при отмене бронирования или обновлении комнат: ', error);
    } finally {
      setBookings(bookings.filter((booking) => !selectedBookingIds.includes(booking._id)));
      setRowSelection({});
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

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
        <li>Номер паспорта: {session?.user?.passportNumber}</li>
        <li>Серия паспорта: {session?.user?.passportSeries}</li>
        <li>Адрес регистрации: {session?.user?.registrationAddress}</li>
      </ul>
      <Typography variant="h5">Арендованные номера</Typography>
      <div className="flex gap-x-3 my-5">
        <Button
          variant="contained"
          color="error"
          disabled={!Object.keys(rowSelection).length}
          onClick={handleCancelBooking}
        >
          Отменить бронирование
        </Button>
      </div>
      <Paper className="mt-5 block w-full overflow-hidden">
        <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              {tableInstance.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell sx={{ textAlign: 'center' }} key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>
            <TableBody>
              {tableInstance.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell sx={{ textAlign: 'center' }} key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
