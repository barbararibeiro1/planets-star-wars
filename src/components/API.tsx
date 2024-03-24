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
  const [sort, setSort] = useState({ column: 'population', order: 'ASC' });

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

  function applyTextFilter(planetsData: Planet[], textFilter: string) {
    return planetsData.filter((planet) => planet.name.includes(textFilter));
  }

  useEffect(() => {
    if (data) {
      let newData = applyNumericFilters(data, numericFilters);
      newData = applyTextFilter(newData, filterText);
      newData = sortData(newData, sort);
      setFilteredData(newData);
    }
  }, [numericFilters, data, sort, filterText]);

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
      let newData = applyNumericFilters(data, numericFilters);
      newData = sortData(newData, sort);
      setFilteredData(newData);
    }
  }, [numericFilters, data, sort]);

  function applyNumericFilters(planetsData: Planet[], filters: any[]) {
    let dataFiltered = [...planetsData];

    filters.forEach((filter) => {
      dataFiltered = dataFiltered.filter((planet) => {
        return compareNumbers(planet[filter.column], filter.comparison, filter.value);
      });
    });

    return dataFiltered;
  }

  function calculateValue(columnValue: string, order: string) {
    let result;
    if (columnValue === 'unknown') {
      if (order === 'ASC') {
        result = Infinity;
      } else {
        result = -Infinity;
      }
    } else {
      result = Number(columnValue);
    }
    return result;
  }

  function sortData(dataToSort: Planet[], sortOption: any) {
    return dataToSort.sort((a, b) => {
      const first = calculateValue(a[sortOption.column], sortOption.order);
      const second = calculateValue(b[sortOption.column], sortOption.order);

      return sortOption.order === 'ASC' ? first - second : second - first;
    });
  }

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
      <select
        data-testid="column-sort"
        value={ sort.column }
        onChange={ ({ target }) => setSort({ ...sort, column: target.value }) }
      >
        { COLUMNS.map((col) => (
          <option key={ col } value={ col }>
            { col }
          </option>
        )) }
      </select>

      <label htmlFor="asc">
        Ascendente
        <input
          type="radio"
          id="asc"
          data-testid="column-sort-input-asc"
          value="ASC"
          checked={ sort.order === 'ASC' }
          onChange={ ({ target }) => setSort({ ...sort, order: target.value }) }
        />
      </label>
      <label htmlFor="desc">
        Descendente
        <input
          type="radio"
          id="desc"
          data-testid="column-sort-input-desc"
          value="DESC"
          checked={ sort.order === 'DESC' }
          onChange={ ({ target }) => setSort({ ...sort, order: target.value }) }
        />
      </label>

      <button
        data-testid="column-sort-button"
      >
        Ordenar
      </button>

      { numericFilters.map((filter, index) => (
        <div key={ index } data-testid="filter">
          <p>
            { filter.column }
            { filter.comparison }
            { filter.value }
          </p>
          <button onClick={ () => handleRemoveFilter(index) }>X</button>
        </div>
      )) }
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
