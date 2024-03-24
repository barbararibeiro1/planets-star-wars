import { useState, useEffect } from 'react';
import useFetch from '../hooks/useFetch';
import Table from './Table';
import { PlanetProps as Planet, PlanetKey } from '../types/types';

const COLUMNS = ['population', 'orbital_period', 'diameter',
  'rotation_period', 'surface_water'] as const;

function RequisitionApi() {
  const url = 'https://swapi.dev/api/planets';
  const { data, loading, error } = useFetch<Planet[]>(url);

  const [filterText, setFilterText] = useState('');
  const [column, setColumn] = useState<PlanetKey>('population');
  const [comparison, setComparison] = useState('maior que');
  const [value, setValue] = useState('0');
  const [filteredData, setFilteredData] = useState<Planet[] | null>(null);
  const [numericFilters, setNumericFilters] = useState<Array<{
    column: PlanetKey, comparison: string, value: string }>>([]);
  const [usedColumns, setUsedColumns] = useState<string[]>([]);

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

  useEffect(() => {
    if (data) {
      const newData = data.filter((planet) => {
        return planet.name.toLowerCase().includes(filterText.toLowerCase());
      });
      setFilteredData(newData);
    }
  }, [filterText, data]);

  const handleAddFilter = () => {
    const newFilters = [...numericFilters, { column, comparison, value }];
    setUsedColumns([...usedColumns, column]);
    setNumericFilters(newFilters);
    setColumn('population');
    setComparison('maior que');
    setValue('0');
  };

  const handleRemoveFilter = (indexToRemove: number) => {
    const columnToFree = numericFilters[indexToRemove].column;
    setUsedColumns(usedColumns.filter((usedColumn) => usedColumn !== columnToFree));
    setNumericFilters(numericFilters.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveAllFilters = () => {
    setNumericFilters([]);
    setUsedColumns([]);
  };

  useEffect(() => {
    if (data) {
      let newData = [...data];

      numericFilters.forEach((filter) => {
        newData = newData.filter((planet) => {
          return compareNumbers(planet[filter.column], filter.comparison, filter.value);
        });
      });

      setFilteredData(newData);
    }
  }, [numericFilters, data]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <input
        type="text"
        value={ filterText }
        onChange={ handleFilterChange }
        data-testid="name-filter"
        placeholder="Pesquisar por nome"
      />
      <select
        value={ column }
        data-testid="column-filter"
        onChange={ handleColumnChange }
      >
        {COLUMNS.filter((c) => !usedColumns.includes(c)).map((c) => (
          <option key={ c } value={ c }>{ c }</option>
        ))}
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
        onClick={ handleAddFilter }
        disabled={ usedColumns.length >= 5 }
      >
        Filtrar
      </button>
      <button
        onClick={ handleRemoveAllFilters }
        data-testid="button-remove-filters"
      >
        Remover todas filtragens
      </button>

      {numericFilters.map((filter, index) => (
        <div key={ index } data-testid="filter">
          <p>
            { filter.column }
            { filter.comparison }
            { filter.value }
          </p>
          <button onClick={ () => handleRemoveFilter(index) }>X</button>
        </div>
      ))}
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
