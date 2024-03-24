import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RequisitionApi from '../components/API'
import Table from '../components/Table';

const mockData = [
  {
    name: 'Tatooine',
    rotation_period: '23',
    orbital_period: '304',
    diameter: '10465',
    climate: 'arid',
    gravity: '1 standard',
    terrain: 'desert',
    surface_water: '1',
    population: '200000',
    films: ['A New Hope', 'The Empire Strikes Back'],
    created: '2014-12-09T13:50:49.641000Z',
    edited: '2014-12-20T20:58:18.411000Z',
    url: 'https://swapi.dev/api/planets/1/',
  },
  {
    name: 'Alderaan',
    rotation_period: '24',
    orbital_period: '364',
    diameter: '12500',
    climate: 'temperate',
    gravity: '1 standard',
    terrain: 'grasslands, mountains',
    surface_water: '40',
    population: '2000000000',
    films: ['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi'],
    created: '2014-12-10T11:35:48.479000Z',
    edited: '2014-12-20T20:58:18.420000Z',
    url: 'https://swapi.dev/api/planets/2/',
  },
  {
    name: 'Yavin IV',
    rotation_period: '24',
    orbital_period: '4818',
    diameter: '10200',
    climate: 'temperate, tropical',
    gravity: '1 standard',
    terrain: 'jungle, rainforests',
    surface_water: '8',
    population: '1000',
    films: ['A New Hope'],
    created: '2014-12-10T11:37:19.144000Z',
    edited: '2014-12-20T20:58:18.421000Z',
    url: 'https://swapi.dev/api/planets/3/',
  }
];

describe('Testa se os elementos estão sendo corretamente renderizados na tela', () => {
  test("Verifica se o botão de filtro está sendo renderizado", () => {
    render(<RequisitionApi />);    
    const filterButton = screen.getByTestId("button-filter");    
    expect(filterButton).toBeInTheDocument();
  });
  test ('Verifica a existência de input para pesquisar planeta pelo nome', () => {
    render(<RequisitionApi />);
    const inputName = screen.getByTestId('name-filter');
    expect(inputName).toBeInTheDocument();
  });
  test ('Verifica a existência de select para filtrar por coluna', () => {
    render(<RequisitionApi />);
    const selectColumn = screen.getByTestId('column-filter');
    expect(selectColumn).toBeInTheDocument();
  });
  test ('Verifica a existência de select para filtrar por comparação', () => {
    render(<RequisitionApi />);
    const selectComparison = screen.getByTestId('comparison-filter');
    expect(selectComparison).toBeInTheDocument();
  });
  test ('Verifica a existência de input para filtrar por valor', () => {
    render(<RequisitionApi />);
    const inputValue = screen.getByTestId('value-filter');
    expect(inputValue).toBeInTheDocument();
  });
  test ('Verifica a existência de botão para adicionar filtro', () => {
    render(<RequisitionApi />);
    const buttonAddFilter = screen.getByTestId('button-filter');
    expect(buttonAddFilter).toBeInTheDocument();
  });
})

describe('Testa a funcionalidade dos filtros', () => {
  test('Verifica o funcionamento dos filtros', () => {
    render(<RequisitionApi />);

    const columnEl = screen.getByTestId('column-filter');
    const comparisonEl = screen.getByTestId('comparison-filter');
    const valueEl = screen.getByTestId('value-filter');
    const buttonAddFilter = screen.getByTestId('button-filter');

    fireEvent.change(columnEl, { target: { value: 'population' } });
    fireEvent.change(comparisonEl, { target: { value: 'maior que' } });
    fireEvent.change(valueEl, { target: { value: '1000000' } });
    fireEvent.click(buttonAddFilter);
  });
})

describe('Table', () => {
  test('renders correctly', () => {
    render(<Table planets={mockData} />);

    const headers = screen.getAllByRole('columnheader');
    expect(headers).toHaveLength(13);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
  });

  test('renders planet data correctly', () => {
    render(<Table planets={mockData} />);

    const firstPlanetCell = screen.getByText('Tatooine');
    expect(firstPlanetCell).toBeInTheDocument();

    const planetPopulationCell = screen.getByText('200000');
    expect(planetPopulationCell).toBeInTheDocument();
  });
});
