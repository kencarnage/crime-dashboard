import React, { useState, useEffect } from 'react';
import { FilterGroup } from './components/FilterGroup';
import { StatCard } from './components/StatCard';
import { BarChart } from './components/BarChart';
import { AreaChart } from './components/AreaChart';
import { NewYorkMap } from './components/NewYorkMap.jsx';
import { fetchCrimeData } from './services/api';

function App() {
  const [suspectAge, setSuspectAge] = useState(null);
  const [suspectSex, setSuspectSex] = useState(null);
  const [victimAge, setVictimAge] = useState(null);
  const [victimSex, setVictimSex] = useState(null);

  const [data, setData] = useState({
    locationData: [],
    crimeData: [],
    hourlyData: [],
    mapPoints: [],
    sharePercentage: '0%',
  });

  const [isDataFetched, setIsDataFetched] = useState(false);

  useEffect(() => {
    const updateData = async () => {
      try {
        const newData = await fetchCrimeData({
          suspectAge,
          suspectSex,
          victimAge,
          victimSex,
        });

        setData(newData);
        setIsDataFetched(true);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    updateData();
  }, [suspectAge, suspectSex, victimAge, victimSex]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Suspect Background</h2>
              <FilterGroup
                title="Age"
                filters={['<18', '18-24', '25-44', '45-64', '65+']}
                activeFilter={suspectAge}
                onFilterChange={setSuspectAge}
                onReset={() => setSuspectAge(null)}
              />
              <FilterGroup
                title="Sex"
                filters={['Male', 'Female']}
                activeFilter={suspectSex}
                onFilterChange={setSuspectSex}
                onReset={() => setSuspectSex(null)}
              />
            </div>

            <div className="bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Victim Background</h2>
              <FilterGroup
                title="Age"
                filters={['<18', '18-24', '25-44', '45-64', '65+']}
                activeFilter={victimAge}
                onFilterChange={setVictimAge}
                onReset={() => setVictimAge(null)}
              />
              <FilterGroup
                title="Sex"
                filters={['Male', 'Female']}
                activeFilter={victimSex}
                onFilterChange={setVictimSex}
                onReset={() => setVictimSex(null)}
              />
            </div>
          </div>

          <div className="lg:col-span-3 bg-gray-800 rounded-lg shadow-md p-6">
            <NewYorkMap className="h-96 w-full lg:h-full lg:w-full" mapPoints={data.mapPoints} />
          </div>
        </div>

        {isDataFetched ? (
          <>
            <div
              className="grid grid-cols-1 lg:grid-cols-[1fr,4fr,2fr] gap-6"
            >
              <StatCard title="Share of all crimes" value={data.sharePercentage} />
              <BarChart title="Top crime locations" data={data.locationData} />
              <BarChart title="Crimes by law category" data={data.crimeData} />
            </div>

            <div className="grid grid-cols-1 gap-0">
              <AreaChart title="Crime rate by hour" data={data.hourlyData} />
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <span className="ml-4 text-xl font-semibold text-gray-300">Fetching data, please wait...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
