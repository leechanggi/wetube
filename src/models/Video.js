import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  title: { type: String, require: true, minLength: 8, maxLength: 16 },
  description: { type: String, require: true, maxLength: 24 },
  createdAt: { type: Date, require: true, default: Date.now },
  hashtags: [{ type: String, require: false, trim: true }],
  meta: {
    views: { type: Number, require: true, default: 0 },
    rating: { type: Number, require: true, default: 0 },
  },
});

const Video = mongoose.model('Video', videoSchema);

export default Video;
