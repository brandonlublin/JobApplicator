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
    console.log('✅ Connected to MongoDB');
    
    mongoose.connection.on('disconnected', () => {
      isDBConnected = false;
      console.warn('⚠️  MongoDB disconnected');
    });
    
    mongoose.connection.on('reconnected', () => {
      isDBConnected = true;
      console.log('✅ MongoDB reconnected');
    });
    
    mongoose.connection.on('error', (err) => {
      isDBConnected = false;
      console.error('❌ MongoDB connection error:', err);
    });
  } catch (err) {
    isDBConnected = false;
    console.error('❌ MongoDB connection error:', err);
  }
};

export const checkDBConnection = (): boolean => {
  return isDBConnected && mongoose.connection.readyState === 1;
};

