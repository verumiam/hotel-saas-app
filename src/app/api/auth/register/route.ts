import User, { IUser } from '@/models/user';
import connect from '@/lib/db-connect';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export const POST = async (request: any, res: any) => {
  if (request.method !== 'POST') {
    return new NextResponse('Method now allowed', { status: 405 });
  }

  const { email, password, name, lastName } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return new NextResponse('User with this email already exists', { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 5);

  const newUser: IUser = new User({
    email,
    password: hashedPassword,
    name,
    lastName,
    passportNumber: '',
    passportSeries: '',
    registrationAddress: '',
  });

  try {
    await newUser.save();
    return new NextResponse('User registered and signed in successfully', { status: 200 });
  } catch (error) {
    return new NextResponse('User registered failed', { status: 500 });
  }
};
