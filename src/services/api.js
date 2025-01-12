const API_URL = 'http://localhost:3001/api';

export async function fetchCrimeData(filters) {
  try {
    const response = await fetch(`${API_URL}/crime-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching crime data:', error);
    throw error;
  }
}
