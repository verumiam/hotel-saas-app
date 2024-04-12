import { IRoom } from '@/models/room';

export async function getRoom(id: string): Promise<IRoom> {
  const response = await fetch(`/api/rooms/list?roomID=${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data[0];
}
