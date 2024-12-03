function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function adjustValue(baseValue, filters) {
  let multiplier = 1;
  
  if (filters.suspectAge || filters.suspectSex || filters.victimAge || filters.victimSex) {
    multiplier += 0.2 * Object.values(filters).filter(Boolean).length;
  }
  
  return Math.round(baseValue * multiplier);
}

export function generateCrimeData(suspectAge, suspectSex, victimAge, victimSex) {
  const filters = { suspectAge, suspectSex, victimAge, victimSex };
  
  // Generate location data
  const locationData = [
    { label: 'APT. HOUSE', value: adjustValue(450, filters) },
    { label: 'PUBLIC HOUSING', value: adjustValue(350, filters) },
    { label: 'STREET', value: adjustValue(250, filters) },
    { label: 'SUBWAY', value: adjustValue(100, filters) },
  ];

  // Generate crime category data
  const crimeData = [
    { label: 'Felony', value: adjustValue(350, filters) },
    { label: 'Misdemeanor', value: adjustValue(550, filters) },
    { label: 'Violation', value: adjustValue(400, filters) },
  ];

  // Generate hourly data
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: adjustValue(30 + getRandomInt(0, 50), filters),
  }));

  // Generate map points
  const mapPoints = Array.from({ length: 100 }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    intensity: Math.random(),
  }));

  // Calculate total share
  const totalCrimes = 1500;
  const filteredCrimes = adjustValue(400, filters);
  const sharePercentage = Math.round((filteredCrimes / totalCrimes) * 100);

  return {
    locationData,
    crimeData,
    hourlyData,
    mapPoints,
    sharePercentage: `${sharePercentage}%`,
  };
}