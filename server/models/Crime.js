import mongoose from 'mongoose';

const crimeSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'], // GeoJSON type must be "Point"
      required: true
    },
    coordinates: {
      type: [Number], // Array of numbers: [longitude, latitude]
      required: true
    }
  },
  category: { type: String, required: true },
  suspect: {
    age: { type: String, required: true },
    sex: { type: String, required: true }
  },
  victim: {
    age: { type: String, required: true },
    sex: { type: String, required: true }
  }
});

crimeSchema.index({ location: '2dsphere' }); // Ensure 2dsphere index

export default mongoose.model('Crime', crimeSchema);
