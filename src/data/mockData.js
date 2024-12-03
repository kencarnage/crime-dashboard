export const locationData = [
  { label: 'APT. HOUSE', value: 450 },
  { label: 'PUBLIC HOUSING', value: 350 },
  { label: 'STREET', value: 250 },
  { label: 'SUBWAY', value: 100 },
];

export const crimeData = [
  { label: 'Felony', value: 350 },
  { label: 'Misdemeanor', value: 550 },
  { label: 'Violation', value: 400 },
];

export const hourlyData = Array.from({ length: 24 }, (_, i) => ({
  hour: i,
  value: 30 + Math.random() * 50,
}));