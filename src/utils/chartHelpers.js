export function calculateMaxValue(data, key = 'value') {
  return Math.max(...data.map(item => item[key]));
}

export function generateHourLabels() {
  return [0, 6, 12, 18, 23];
}

export function generateRandomPoints(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100
  }));
}