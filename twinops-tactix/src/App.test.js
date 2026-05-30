import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the factory digital twin dashboard', () => {
  render(<App />);
  expect(screen.getByText(/Agentic AI-Human Machine Control/i)).toBeInTheDocument();
});
