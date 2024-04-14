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
  TablePagination,
  Button,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getPaginationRowModel,
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
import { getRoomsList } from '@/network/rooms/getRoomsList';
import { updateRoom } from '@/network/rooms/updateRoom';

export default function ClientsManage() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
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
      pagination,
    },
    getRowId: (row) => row._id,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(users.length / pagination.pageSize),
  });

  const renderPagination = () => (
    <TablePagination
      component="div"
      count={users.length}
      page={pagination.pageIndex}
      onPageChange={(event, newPage) => setPagination((old) => ({ ...old, pageIndex: newPage }))}
      rowsPerPage={pagination.pageSize}
      onRowsPerPageChange={(event) =>
        setPagination((old) => ({ ...old, pageSize: parseInt(event.target.value, 10) }))
      }
    />
  );

  const handleDeleteSelectedUsers = async () => {
    const selectedClientIds = Object.keys(rowSelection);

    try {
      setLoading(true);
      const bookingForDeleting: IBooking[] = await getBookingList(selectedClientIds);
      const rooms: IRoom[] = await getRoomsList();

      const roomsToUpdate = rooms.filter(
        (room) => room.occupants && selectedClientIds.includes(room.occupants.toString())
      );

      await Promise.all([
        ...selectedClientIds.map((_id) => deleteUser(_id)),
        ...bookingForDeleting.map((booking) => cancelBookings(booking._id)),
        ...roomsToUpdate.map((room) =>
          updateRoom({ isAvailable: true, occupants: [] }, room._id.toString())
        ),
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="mt-[60px]">
      <span className="text-[24px]">Управление клиентами</span>
      <div className="flex gap-x-3 my-5">
        <Button
          variant="contained"
          color="error"
          disabled={Object.keys(rowSelection).length === 0}
          onClick={handleDeleteSelectedUsers}
        >
          Удалить выбранных клиентов
        </Button>
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
        {renderPagination()}
      </Paper>
    </Container>
  );
}
