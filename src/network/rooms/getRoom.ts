import { IRoom } from '@/models/room';

export default async function getRoom(id: string): Promise<IRoom> {
  const response = await fetch(`/api/rooms/list?roomID=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  return data[0];
}
