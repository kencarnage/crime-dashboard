import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { getCrimeData } from './controllers/crimeController.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.post('/api/crime-data', async (req, res) => {
  try {
    const { suspectAge, suspectSex, victimAge, victimSex } = req.body;
    const data = await getCrimeData({ suspectAge, suspectSex, victimAge, victimSex });
    res.json(data);
  } catch (error) {
    console.error('Error fetching crime data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});