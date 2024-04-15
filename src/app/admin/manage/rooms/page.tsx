'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Container,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
} from '@mui/material';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  getFilteredRowModel,
  RowSelectionState,
} from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { getRoomsList } from '@/network/rooms';
import deleteRoom from '@/network/rooms/deleteRoom';
import { IRoom } from '@/models/room';
import Spinner from '@/components/shared/spinner/spinner';

export default function ManageRooms() {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [rooms, setRooms] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRoomsList();
        setRooms(data);
      } catch (error) {
        console.error('Ошибка при получении списка номеров:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
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
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 45,
      },
      {
        accessorKey: 'roomNumber',
        header: 'Номер',
      },
      {
        accessorKey: 'roomType',
        header: 'Тип',
      },
      {
        accessorKey: 'price',
        header: 'Цена',
      },
      {
        accessorKey: 'capacity',
        header: 'Вместительность',
      },
      {
        accessorKey: 'amenities',
        header: 'Услуги',
        cell: (info: any) => info.getValue().join(', '),
      },
      {
        accessorKey: 'isAvailable',
        header: 'Доступность',
        cell: (info: any) => (info.getValue() ? 'Доступен к бронированию' : 'Занят'),
      },
      {
        accessorKey: 'description',
        header: 'Описание',
      },
      {
        accessorKey: 'occupants',
        header: 'Клиент',
        cell: (info: any) => info.getValue(),
      },
    ],
    []
  );

  const table = useReactTable({
    data: rooms,
    columns,
    state: {
      rowSelection,
    },
    getRowId: (row: any) => row._id,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  const handleDeleteRoom = async () => {
    const selectedRoomIds = Object.keys(rowSelection);

    try {
      setLoading(true);
      const response = await deleteRoom(selectedRoomIds);
      if (response.status === 200) {
        setRooms((currentRooms) =>
          currentRooms.filter((room: IRoom) => !selectedRoomIds.includes(room._id))
        );
        setRowSelection({});
      }
    } catch (error) {
      console.error('Ошибка при удалении номера: ', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Container className="my-[60px]">
      <span className="text-[24px]">Управление номерами</span>
      <div className="flex gap-x-3 my-5">
        <Button
          variant="contained"
          color="error"
          onClick={() => router.push('/admin/manage/rooms/0?mode=create')}
        >
          Создать номер
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={Object.keys(rowSelection).length !== 1}
          onClick={() =>
            router.push(`/admin/manage/rooms/${encodeURI(Object.keys(rowSelection)[0])}?mode=edit`)
          }
        >
          Изменить номер
        </Button>
        <Button
          variant="contained"
          color="error"
          disabled={!Object.keys(rowSelection).length}
          onClick={handleDeleteRoom}
        >
          Удалить номер
        </Button>
      </div>
      <Paper>
        <Table>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
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
            {table.getRowModel().rows.map((row) => (
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
