import mongoose from 'mongoose';

let isDBConnected = false;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobTracker';
    
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    isDBConnected = true;
    
    mongoose.connection.on('disconnected', () => {
      isDBConnected = false;
    });
    
    mongoose.connection.on('reconnected', () => {
      isDBConnected = true;
    });
    
    mongoose.connection.on('error', () => {
      isDBConnected = false;
    });
  } catch {
    isDBConnected = false;
  }
};

export const checkDBConnection = (): boolean => {
  return isDBConnected && mongoose.connection.readyState === 1;
};

