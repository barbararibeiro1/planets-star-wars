import { useState } from 'react';
import useFetch from '../hooks/useFetch';
import Table from './Table';
import { PlanetProps as Planet, PlanetKey } from '../types/types';

function RequisitionApi() {
  const url = 'https://swapi.dev/api/planets';
  const { data, loading, error } = useFetch<Planet[]>(url);

  const [filterText, setFilterText] = useState('');
  const [column, setColumn] = useState<PlanetKey>('population');
  const [comparison, setComparison] = useState('maior que');
  const [value, setValue] = useState('0');
  const [filteredData, setFilteredData] = useState<Planet[] | null>(null);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(event.target.value);
  };

  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setColumn(event.target.value as PlanetKey);
  };

  const handleComparisonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setComparison(event.target.value);
  };

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleFilterClick = () => {
    if (data) {
      const newData = data.filter((planet) => {
        const textMatches = planet.name.toLowerCase().includes(filterText.toLowerCase());
        const numberMatches = compareNumbers(planet[column], comparison, value);
        return textMatches && numberMatches;
      });
      setFilteredData(newData);
    }
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <input
        type="text"
        value={ filterText }
        onChange={ handleFilterChange }
        data-testid="name-filter"
      />
      <select
        value={ column }
        data-testid="column-filter"
        onChange={ handleColumnChange }
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>
      <select
        value={ comparison }
        onChange={ handleComparisonChange }
        data-testid="comparison-filter"
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>
      <input
        type="number"
        value={ value }
        onChange={ handleValueChange }
        data-testid="value-filter"
      />
      <button
        data-testid="button-filter"
        onClick={ handleFilterClick }
      >
        Filtrar
      </button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table planets={ filteredData || data || [] } />
      )}
    </div>
  );
}

function compareNumbers(planetValue: string, comparison: string, value: string) {
  if (!planetValue || !comparison || !value) return true;

  const numberValue = Number(value);
  const numberPlanetValue = Number(planetValue);

  switch (comparison) {
    case 'maior que':
      return numberPlanetValue > numberValue;
    case 'menor que':
      return numberPlanetValue < numberValue;
    case 'igual a':
      return numberPlanetValue === numberValue;
    default:
      return true;
  }
}

export default RequisitionApi;
