import connect from '@/lib/db-connect';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export const DELETE = async (request: any, res: any) => {
  if (request.method !== 'DELETE') {
    return new NextResponse('Method not allowed', { status: 405 });
  }

  await connect();

  const { ids } = await request.json();

  try {
    if (Array.isArray(ids)) {
      await User.deleteMany({ _id: { $in: ids } });
    } else {
      await User.deleteOne({ _id: ids });
    }

    return new NextResponse('Клиенты удалены', {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error deleting users: ' + error.message });
  }
};
