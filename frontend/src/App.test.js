import { render, screen } from '@testing-library/react';
import App from './App';
test('renders Gather homepage', () => {
  render(<App />);
  expect(
    screen.getByRole('heading', { name: /welcome to gather/i })
  ).toBeInTheDocument();

  expect(
    screen.getByText(/your event planning and booking platform/i)
  ).toBeInTheDocument();
});
