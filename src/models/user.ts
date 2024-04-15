import mongoose, { Document, Model } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  lastName: string;
  role: string;
  passportNumber: string;
  passportSeries: string;
  registrationAddress: string;
}

const { Schema, models, model } = mongoose;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    passportNumber: {
      type: String,
      default: '',
    },
    passportSeries: {
      type: String,
      default: '',
    },
    registrationAddress: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const User: Model<IUser> = models.User || model('User', UserSchema);

export default User;
