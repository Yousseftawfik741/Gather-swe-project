
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('Gather homepage', () => {
  test('renders the homepage components', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('heading', {
        name: /every occasion deserves to be unforgettable/i
      })
    ).toBeInTheDocument();

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  test('all internal navigation links point to existing sections', () => {
    render(<App />);

    screen.getAllByRole('link').forEach((link) => {
      const href = link.getAttribute('href');

      if (href && href.startsWith('#')) {
        expect(
          document.getElementById(href.substring(1))
        ).toBeInTheDocument();
      }
    });
  });

  test('navigation contains only implemented destinations', () => {
    render(<App />);

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation'
    });

    expect(
      within(navigation).getByRole('link', { name: 'Home' })
    ).toHaveAttribute('href', '#home');

    expect(
      within(navigation).getByRole('link', { name: 'Events' })
    ).toHaveAttribute('href', '#events');

    ['Venues', 'Services', 'Packages', 'Log In', 'Sign Up'].forEach(
      (label) => {
        expect(
          within(navigation).queryByRole('link', { name: label })
        ).not.toBeInTheDocument();
      }
    );
  });

  test('Hero buttons navigate to the existing events section', () => {
    render(<App />);

    expect(
      screen.getByRole('link', { name: /explore occasions/i })
    ).toHaveAttribute('href', '#events');

    expect(
      screen.getByRole('link', { name: /discover events/i })
    ).toHaveAttribute('href', '#events');
  });

  test('Footer links navigate to existing homepage sections', () => {
    render(<App />);

    const footer = screen.getByRole('contentinfo');

    within(footer).getAllByRole('link').forEach((link) => {
      const href = link.getAttribute('href');

      if (href && href.startsWith('#')) {
        expect(
          document.getElementById(href.substring(1))
        ).toBeInTheDocument();
      }
    });
  });

  test('renders all event categories', () => {
    render(<App />);

    [
      'Weddings',
      'Birthdays',
      'Parties & Celebrations',
      'Corporate Events',
      'Live Entertainment'
    ].forEach((category) => {
      expect(
        screen.getByRole('heading', { name: category })
      ).toBeInTheDocument();
    });
  });
});

describe('Mobile navigation menu', () => {
  test('opens when the menu button is clicked', () => {
    render(<App />);

    const menuButton = screen.getByRole('button', {
      name: 'Open navigation menu'
    });

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation'
    });

    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(navigation).not.toHaveClass('active');

    userEvent.click(menuButton);

    expect(
      screen.getByRole('button', { name: 'Close navigation menu' })
    ).toHaveAttribute('aria-expanded', 'true');

    expect(navigation).toHaveClass('active');
  });

  test('closes when the menu button is clicked again', () => {
    render(<App />);

    userEvent.click(
      screen.getByRole('button', { name: 'Open navigation menu' })
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Close navigation menu' })
    );

    expect(
      screen.getByRole('button', { name: 'Open navigation menu' })
    ).toHaveAttribute('aria-expanded', 'false');

    expect(
      screen.getByRole('navigation', { name: 'Main navigation' })
    ).not.toHaveClass('active');
  });

  test('closes after selecting a navigation link', () => {
    render(<App />);

    userEvent.click(
      screen.getByRole('button', { name: 'Open navigation menu' })
    );

    const navigation = screen.getByRole('navigation', {
      name: 'Main navigation'
    });

    userEvent.click(
      within(navigation).getByRole('link', { name: 'Events' })
    );

    expect(
      screen.getByRole('button', { name: 'Open navigation menu' })
    ).toHaveAttribute('aria-expanded', 'false');

    expect(navigation).not.toHaveClass('active');
  });
});
