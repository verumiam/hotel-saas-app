import mongoose, { Document, Model } from 'mongoose';

export interface IRoom extends Document {
  _id: string;
  roomNumber: string;
  photos: Buffer[];
  roomType: string;
  price: number;
  capacity: number;
  amenities: string[];
  isAvailable: boolean;
  description: string;
  singleBeds: number;
  doubleBeds: number;
  sofas: number;
  squareMeters: number;
  numberOfRooms: number;
  occupants?: mongoose.Schema.Types.ObjectId;
}

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },
    photos: {
      type: [Buffer],
      required: false,
    },
    roomType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    singleBeds: {
      type: Number,
      required: true,
      default: 0,
    },
    doubleBeds: {
      type: Number,
      required: true,
      default: 0,
    },
    sofas: {
      type: Number,
      required: true,
      default: 0,
    },
    squareMeters: {
      type: Number,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    amenities: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    occupants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const Room: Model<IRoom> = mongoose.models.Room || mongoose.model('Room', RoomSchema);

export default Room;
