import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Crime from './models/Crime.js';
import { connectDB } from './config/database.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your CSV file
const csvFilePath = path.join(__dirname, 'config', 'NYPD_Complaint_Data_Current__Year_To_Date__20241205 new data 4.csv');

// Parse Lat_Lon coordinates
function parseCoordinates(latLon) {
  if (!latLon || latLon === '(null)') {
    return null; // Return null if Lat_Lon is missing or invalid
  }
  try {
    const [latitude, longitude] = latLon.replace(/[()]/g, '').split(',').map(Number);
    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Invalid coordinates');
    }
    return [longitude, latitude]; // MongoDB requires [longitude, latitude]
  } catch (error) {
    console.error(`Invalid Lat_Lon: "${latLon}". Skipping.`);
    return null;
  }
}



(async () => {
  try {
    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found at path: ${csvFilePath}`);
    }

    // Connect to MongoDB
    await connectDB();
    console.log('Connected to MongoDB Atlas.');

    const crimes = [];
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        const coordinates = parseCoordinates(row.Lat_Lon);
        if (!coordinates) return; // Skip rows with invalid coordinates

        crimes.push({
          date: new Date(`2024-12-05T${row.Time}`),
          location: {
            type: 'Point',
            coordinates,
          },
          category: row['LAW_CAT_CD'] || 'Unknown',
          suspect: {
            age: row['suspect age group'] || 'Unknown',
            sex: row['suspect sex'] || 'U',
          },
          victim: {
            age: row['victim age group'] || 'Unknown',
            sex: row['victim sex'] || 'U',
          },
          locationName: row['location name'] || 'Unknown',
        });
      })
      .on('end', async () => {
        try {
          await Crime.insertMany(crimes);
          console.log('Database seeded successfully.');

        } catch (error) {
          console.error('Error inserting data:', error.message);
          process.exit(1);
        }
      });
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
})();