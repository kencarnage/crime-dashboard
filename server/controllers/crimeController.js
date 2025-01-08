import Crime from '../models/Crime.js';

// Main function to fetch crime data
export async function getCrimeData(filters) {
  const query = buildQuery(filters);

  const [
    locationData,
    crimeData,
    hourlyData,
    totalCount,
    filteredCount,
  ] = await Promise.all([
    getLocationData(query),
    getCrimeCategoryData(query),
    getHourlyData(query),
    Crime.countDocuments({}),
    Crime.countDocuments(query),
  ]);

  // Fetch map points based on the query
  const mapPoints = await getMapPoints(query);

  return {
    locationData,
    crimeData,
    hourlyData,
    mapPoints,
    sharePercentage: `${Math.round((filteredCount / totalCount) * 100)}%`,
  };
}

// Build query based on filters
function buildQuery({ suspectAge, suspectSex, victimAge, victimSex }) {
  const query = {};

  // Suspect filters
  if (suspectAge) query['suspect.age'] = suspectAge;
  if (suspectSex) query['suspect.sex'] = convertSexFilter(suspectSex);

  // Victim filters
  if (victimAge) query['victim.age'] = victimAge;
  if (victimSex) query['victim.sex'] = convertSexFilter(victimSex);

  return query;
}

// Utility function to map sex filter to database values
function convertSexFilter(sex) {
  switch (sex) {
    case 'Male':
      return 'M';
    case 'Female':
      return 'F';
    default:
      return 'U'; // Default case for unknown/undefined
  }
}

// Fetch top crime locations
async function getLocationData(query) {
  const locations = await Crime.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$locationName',
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: 1,
      },
    },
    { $sort: { value: -1 } },
    { $limit: 3 }, // Return top 3 locations
  ]);

  return locations;
}

// Fetch crime categories
async function getCrimeCategoryData(query) {
  const categories = await Crime.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: 1,
      },
    },
  ]);

  return categories;
}

// Fetch hourly crime data
async function getHourlyData(query) {
  const hourlyStats = await Crime.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $hour: '$date' },
        value: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        hour: '$_id',
        value: 1,
      },
    },
    { $sort: { hour: 1 } },
  ]);

  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const found = hourlyStats.find((stat) => stat.hour === hour);
    return { hour, value: found ? found.value : 0 };
  });

  return hourlyData;
}

// Fetch raw map points for the crimes
async function getMapPoints(query) {
  const points = await Crime.aggregate([
    { $match: query },
    {
      $project: {
        _id: 0,
        x: { $arrayElemAt: ['$location.coordinates', 0] },
        y: { $arrayElemAt: ['$location.coordinates', 1] },
      },
    },
  ]);

  return points;
}
