import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crime from './models/Crime.js';
import { connectDB } from './config/database.js';

dotenv.config();

const categories = ['Felony', 'Misdemeanor', 'Violation'];
const ageGroups = ['<18', '18-24', '25-44', '45-64', '65+'];
const sexes = ['Male', 'Female'];

// Generate random longitude and latitude values
function getRandomLongitude() {
  return (Math.random() * 360 - 180).toFixed(6); // Longitude: -180 to 180
}

function getRandomLatitude() {
  return (Math.random() * 180 - 90).toFixed(6); // Latitude: -90 to 90
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function seedDatabase() {
  try {
    await connectDB();

    // Clear existing data
    await Crime.deleteMany({});

    const crimes = Array.from({ length: 10000 }, () => ({
      date: new Date(),
      location: {
        type: "Point",
        coordinates: [getRandomLongitude(), getRandomLatitude()] // [longitude, latitude]
      },
      category: getRandomElement(categories),
      suspect: {
        age: getRandomElement(ageGroups),
        sex: getRandomElement(sexes)
      },
      victim: {
        age: getRandomElement(ageGroups),
        sex: getRandomElement(sexes)
      }
    }));

    await Crime.insertMany(crimes);
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
