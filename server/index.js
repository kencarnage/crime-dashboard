import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/database.js';
import { getCrimeData } from './controllers/crimeController.js';

dotenv.config();

const app = express();
app.use(express.json());

// Allow specific origins for CORS (add your frontend URL if known)
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// API Endpoint to fetch crime data
app.post('/api/crime-data', async (req, res) => {
  try {
    const { suspectAge, suspectSex, victimAge, victimSex } = req.body;

    // Validate the input data
    if (!suspectAge || !suspectSex || !victimAge || !victimSex) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const data = await getCrimeData({ suspectAge, suspectSex, victimAge, victimSex });

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Serve frontend build files
const __dirname = path.resolve();

// Ensure correct path to serve the frontend
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
