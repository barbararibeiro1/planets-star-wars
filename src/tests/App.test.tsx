import React from 'react';
import { render, screen } from '@testing-library/react';
import RequisitionApi from '../components/API'


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
})