import connect from '@/lib/db-connect';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

export const PUT = async (request: any, res: any) => {
  if (request.method !== 'PUT') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  const { user, id } = await request.json();

  await connect();

  const _id = new mongoose.Types.ObjectId(id);

  try {
    const updatedRoom = await User.findByIdAndUpdate(_id, user, { new: true });

    if (!updatedRoom) {
      return new NextResponse('User not found', { status: 404 });
    }

    return new NextResponse('User updating successful', { status: 200 });
  } catch (error: any) {
    return res.status(500).json({ message: 'User updating failed with error: ' + error });
  }
};
