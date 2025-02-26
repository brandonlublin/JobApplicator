import mongoose from 'mongoose';

const appliedJobSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' },
  userId: String,  // If you track users, you can store their ID here
  appliedAt: Date,
});

export const AppliedJobs = mongoose.model('AppliedJobs', appliedJobSchema);