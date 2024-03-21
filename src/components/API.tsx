import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import Table, { PlanetProps as Planet } from './Table';

function RequisitionApi() {
  const url = 'https://swapi.dev/api/planets';
  const { data, loading, error } = useFetch<Planet[]>(url);

  const [filterText, setFilterText] = useState('');

  const handleFilterChange = (event: React.ChangeEvent <HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  if (error) return <p>{error}</p>;

  const filteredData = data ? data.filter((planet) => planet.name.toLowerCase()
    .includes(filterText.toLowerCase())) : [];

  return (
    <div>
      <input
        type="text"
        value={ filterText }
        onChange={ handleFilterChange }
        data-testid="name-filter"
      />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table planets={ filteredData } />
      )}
    </div>
  );
}

export default RequisitionApi;
