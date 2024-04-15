'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  Typography,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
  RowSelectionState,
} from '@tanstack/react-table';
import { getUserList } from '@/network/user/getUserList';
import { IUser } from '@/models/user';
import Spinner from '@/components/shared/spinner/spinner';
import deleteUser from '@/network/user/deleteUser';
import { getBookingList } from '@/network/booking/getBookingList';
import cancelBookings from '@/network/booking/cancelBooking';
import { IBooking } from '@/models/booking';
import { IRoom } from '@/models/room';
import { getRoomsList, updateRoom } from '@/network/rooms';
import { useRouter } from 'next/navigation';

export default function ClientsManage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUserList();
        setUsers(users);
      } catch (error) {
        console.error('Ошибка при получении списка пользователей:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = useMemo(
    () => [
      {
        id: 'selection',
        header: ({ table }: { table: any }) => (
          <Checkbox
            indeterminate={table.getIsSomeRowsSelected()}
            checked={table.getIsAllRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }: { row: any }) => (
          <Checkbox checked={row.getIsSelected()} onChange={row.getToggleSelectedHandler()} />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Имя',
      },
      {
        accessorKey: 'lastName',
        header: 'Фамилия',
      },
      {
        accessorKey: 'email',
        header: 'Email',
      },
      {
        accessorKey: 'passportSeries',
        header: 'Серия паспорта',
      },
      {
        accessorKey: 'passportNumber',
        header: 'Номер паспорта',
      },
      {
        accessorKey: 'registrationAddress',
        header: 'Адрес регистрации',
      },
    ],
    []
  );

  const tableInstance = useReactTable({
    data: users,
    columns,
    state: {
      rowSelection,
    },
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handleDeleteSelectedUsers = async () => {
    const selectedClientIds = Object.keys(rowSelection);

    try {
      setLoading(true);
      const bookingForDeleting: IBooking[] = await getBookingList(selectedClientIds);
      const rooms: IRoom[] = await getRoomsList();

      const roomsToUpdate = rooms.filter(
        (room) => room.occupants && selectedClientIds.includes(room.occupants.toString())
      );

      const response = await Promise.all([
        ...selectedClientIds.map((_id) => deleteUser(_id)),
        ...bookingForDeleting.map((booking) => cancelBookings(booking._id)),
        ...roomsToUpdate.map((room) =>
          updateRoom({ isAvailable: true, occupants: [] }, room._id.toString())
        ),
      ]);

      if (response[0].status === 200) {
        setUsers((prevUsers) => prevUsers.filter((user) => !selectedClientIds.includes(user._id)));
        setRowSelection({});
      }
    } catch (error) {
      console.error(error);
      setError('Произошла ошибка при попытке удалить пользователя');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="my-[60px]">
      <span className="text-[24px]">Управление клиентами</span>
      <div className="flex gap-x-3 my-5 gap-y-1">
        <Button
          variant="contained"
          color="error"
          disabled={Object.keys(rowSelection).length === 0}
          onClick={handleDeleteSelectedUsers}
        >
          Удалить выбранных клиентов
        </Button>
        {error ?? (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
      </div>
      <Paper sx={{ my: 4 }}>
        <Table>
          <TableHead>
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell sx={{ textAlign: 'center' }} key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
      </Paper>
    </Container>
  );
}
