import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

function renderLogin() {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );
}

describe('Login form', () => {
  test('renders the login form', () => {
    renderLogin();

    expect(
      screen.getByRole('heading', { name: 'Welcome back' })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Email address')
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Password', { exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Sign in' })
    ).toBeInTheDocument();
  });

  test('displays errors when required fields are empty', () => {
    renderLogin();

    userEvent.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(
      screen.getByText('Please enter your email address.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Please enter your password.')
    ).toBeInTheDocument();
  });

  test('rejects an invalid email address', () => {
    renderLogin();

    userEvent.type(
      screen.getByLabelText('Email address'),
      'invalid@example'
    );

    userEvent.type(
      screen.getByLabelText('Password', { exact: true }),
      'Test1234'
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(
      screen.getByText('Please enter a valid email address.')
    ).toBeInTheDocument();
  });

  test('shows and hides the password', () => {
    renderLogin();

    const passwordInput = screen.getByLabelText(
      'Password',
      { exact: true }
    );

    expect(passwordInput).toHaveAttribute('type', 'password');

    userEvent.click(
      screen.getByRole('button', { name: 'Show password' })
    );

    expect(passwordInput).toHaveAttribute('type', 'text');

    userEvent.click(
      screen.getByRole('button', { name: 'Hide password' })
    );

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('accepts valid input and displays the unavailable message', () => {
    renderLogin();

    userEvent.type(
      screen.getByLabelText('Email address'),
      'test@example.com'
    );

    userEvent.type(
      screen.getByLabelText('Password', { exact: true }),
      'Test1234'
    );

    userEvent.click(
      screen.getByRole('button', { name: 'Sign in' })
    );

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    expect(
      screen.getByText(
        'Sign-in is not available yet. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  test('clears validation errors after correcting the fields', () => {
    renderLogin();

    const submitButton = screen.getByRole('button', {
      name: 'Sign in'
    });

    userEvent.click(submitButton);

    expect(screen.getAllByRole('alert')).toHaveLength(2);

    userEvent.type(
      screen.getByLabelText('Email address'),
      'test@example.com'
    );

    userEvent.type(
      screen.getByLabelText('Password', { exact: true }),
      'Test1234'
    );

    userEvent.click(submitButton);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});