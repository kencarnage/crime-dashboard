import Crime from '../models/Crime.js';

export async function getCrimeData(filters) {
  const query = buildQuery(filters);
  
  const [
    locationData,
    crimeData,
    hourlyData,
    totalCount,
    filteredCount
  ] = await Promise.all([
    getLocationData(query),
    getCrimeCategoryData(query),
    getHourlyData(query),
    Crime.countDocuments({}),
    Crime.countDocuments(query)
  ]);

  const mapPoints = await getMapPoints(query);

  return {
    locationData,
    crimeData,
    hourlyData,
    mapPoints,
    sharePercentage: `${Math.round((filteredCount / totalCount) * 100)}%`
  };
}

function buildQuery({ suspectAge, suspectSex, victimAge, victimSex }) {
  const query = {};
  
  if (suspectAge) query['suspect.age'] = suspectAge;
  if (suspectSex) query['suspect.sex'] = suspectSex;
  if (victimAge) query['victim.age'] = victimAge;
  if (victimSex) query['victim.sex'] = victimSex;
  
  return query;
}

async function getLocationData(query) {
  const locations = await Crime.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$location.type',
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: 1
      }
    },
    { $sort: { value: -1 } },
    { $limit: 4 }
  ]);
  
  return locations;
}

async function getCrimeCategoryData(query) {
  const categories = await Crime.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$category',
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        label: '$_id',
        value: 1
      }
    }
  ]);
  
  return categories;
}

async function getHourlyData(query) {
  const hourlyStats = await Crime.aggregate([
    { $match: query },
    {
      $group: {
        _id: { $hour: '$date' },
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        hour: '$_id',
        value: 1
      }
    },
    { $sort: { hour: 1 } }
  ]);

  // Ensure all hours are represented
  const hourlyData = Array.from({ length: 24 }, (_, hour) => {
    const found = hourlyStats.find(stat => stat.hour === hour);
    return { hour, value: found ? found.value : 0 };
  });

  return hourlyData;
}

async function getMapPoints(query) {
  const points = await Crime.aggregate([
    { $match: query },
    { $limit: 100 },
    {
      $project: {
        _id: 0,
        x: '$location.coordinates.x',
        y: '$location.coordinates.y',
        intensity: { $rand: {} }
      }
    }
  ]);
  
  return points;
}