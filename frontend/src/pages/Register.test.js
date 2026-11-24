
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

function renderRegister() {
  return render(
    <MemoryRouter>
      <Register />
    </MemoryRouter>
  );
}

function fillForm({
  fullName = 'Test User',
  email = 'test@example.com',
  password = 'Test1234',
  confirmPassword = 'Test1234'
} = {}) {
  userEvent.type(
    screen.getByLabelText('Full name'),
    fullName
  );

  userEvent.type(
    screen.getByLabelText('Email address'),
    email
  );

  userEvent.type(
    screen.getByLabelText('Password', { exact: true }),
    password
  );

  userEvent.type(
    screen.getByLabelText('Confirm password', { exact: true }),
    confirmPassword
  );
}

function submitForm() {
  userEvent.click(
    screen.getByRole('button', { name: 'Create account' })
  );
}

describe('Registration form', () => {
  test('renders the registration form', () => {
    renderRegister();

    expect(
      screen.getByRole('heading', { name: 'Create an account' })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Full name')
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Email address')
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Password', { exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText('Confirm password', { exact: true })
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Create account' })
    ).toBeInTheDocument();
  });

  test('displays errors when all required fields are empty', () => {
    renderRegister();
    submitForm();

    expect(
      screen.getByText('Please enter your full name.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Please enter your email address.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Please enter your password.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Please confirm your password.')
    ).toBeInTheDocument();

    expect(screen.getAllByRole('alert')).toHaveLength(4);
  });

  test('rejects an invalid email address', () => {
    renderRegister();

    fillForm({ email: 'invalid@example' });
    submitForm();

    expect(
      screen.getByText('Please enter a valid email address.')
    ).toBeInTheDocument();
  });

  test('rejects passwords shorter than eight characters', () => {
    renderRegister();

    fillForm({
      password: 'Test123',
      confirmPassword: 'Test123'
    });

    submitForm();

    expect(
      screen.getByText('Password must contain at least 8 characters.')
    ).toBeInTheDocument();
  });

  test('rejects mismatched passwords', () => {
    renderRegister();

    fillForm({
      confirmPassword: 'Different123'
    });

    submitForm();

    expect(
      screen.getByText('Passwords do not match.')
    ).toBeInTheDocument();
  });

  test('shows and hides the password independently', () => {
    renderRegister();

    const passwordInput = screen.getByLabelText(
      'Password',
      { exact: true }
    );

    const confirmPasswordInput = screen.getByLabelText(
      'Confirm password',
      { exact: true }
    );

    expect(passwordInput).toHaveAttribute('type', 'password');

    userEvent.click(
      screen.getByRole('button', { name: 'Show password' })
    );

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    userEvent.click(
      screen.getByRole('button', { name: 'Hide password' })
    );

    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows and hides the confirmation password independently', () => {
    renderRegister();

    const passwordInput = screen.getByLabelText(
      'Password',
      { exact: true }
    );

    const confirmPasswordInput = screen.getByLabelText(
      'Confirm password',
      { exact: true }
    );

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    userEvent.click(
      screen.getByRole('button', { name: 'Show confirm password' })
    );

    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
    expect(passwordInput).toHaveAttribute('type', 'password');

    userEvent.click(
      screen.getByRole('button', { name: 'Hide confirm password' })
    );

    expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('accepts valid input and displays the unavailable message', () => {
    renderRegister();

    fillForm();
    submitForm();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    expect(
      screen.getByText(
        'Registration is not available yet. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  test('clears validation errors after correcting the fields', () => {
    renderRegister();

    submitForm();

    expect(screen.getAllByRole('alert')).toHaveLength(4);

    fillForm();
    submitForm();

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
