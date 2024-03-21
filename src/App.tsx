import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import RequisitionApi from './components/API';

function App() {
  return (
    <>
      <header>
        <h1>Projeto Star Wars - Trybe</h1>
      </header>
      <Routes>
        <Route path="/" element={ <RequisitionApi /> } />
      </Routes>
    </>
  );
}

export default App;
