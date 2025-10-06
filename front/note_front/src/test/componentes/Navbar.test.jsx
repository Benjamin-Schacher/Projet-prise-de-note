import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from '../../components/Navbar.jsx'; // ou import Navbar from ... si default export

describe('Navbar', () => {
  test('Should render without crash', () => {
    render(
      <BrowserRouter>
        <Navbar />
      </BrowserRouter>
    );
  });
});
