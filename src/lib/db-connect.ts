import mongoose, { ConnectOptions } from 'mongoose';

const connect = async () => {
  if (mongoose.connections[0].readyState) return;

  try {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI cannot be empty');

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    console.log('MongoDB connection succeeded');
  } catch (error) {
    throw new Error('Error connections to MongoDB');
  }
};

export default connect;
