import { IRoom } from '@/models/room';

export default async function getRoomsList(): Promise<IRoom[]> {
  const response = await fetch(`/api/rooms/list`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json();
}
