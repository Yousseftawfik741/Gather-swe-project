
import { render, screen, within } from '@testing-library/react';
import App from './App';

test('renders the Gather homepage', () => {
  render(<App />);

  const navigation = screen.getByRole('navigation');

  expect(navigation).toBeInTheDocument();

  expect(
    within(navigation).getByRole('link', { name: 'Home' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', {
      name: /every occasion deserves to be unforgettable/i
    })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('link', { name: /explore venues/i })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('link', { name: /discover events/i })
  ).toBeInTheDocument();

  const categories = [
    'Weddings',
    'Birthdays',
    'Parties & Celebrations',
    'Corporate Events',
    'Live Entertainment'
  ];

  categories.forEach((category) => {
    expect(
      screen.getByRole('heading', { name: category })
    ).toBeInTheDocument();
  });

  expect(screen.getByRole('contentinfo')).toBeInTheDocument();

  expect(
    screen.getByRole('heading', { name: 'Explore' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('heading', { name: 'Occasions' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('link', { name: /explore gather/i })
  ).toBeInTheDocument();
});
