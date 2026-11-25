
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isValidEmail } from '../utils/validation';
import './Auth.css';

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = {};

    if (!fullName.trim()) {
      validationErrors.fullName = 'Please enter your full name.';
    }

    if (!email.trim()) {
      validationErrors.email = 'Please enter your email address.';
    } else if (!isValidEmail(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      validationErrors.password = 'Please enter your password.';
    } else if (password.length < 8) {
      validationErrors.password = 'Password must contain at least 8 characters.';
    }

    if (!confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(validationErrors);
    setMessage('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setMessage('Registration is not available yet. Please try again later.');
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <aside className="auth-visual">
          <Link to="/" className="auth-brand">
            Gather<span>.</span>
          </Link>

          <div className="auth-arch auth-arch-outer" aria-hidden="true"></div>
          <div className="auth-arch auth-arch-inner" aria-hidden="true"></div>

          <div className="auth-visual-content">
            <h2>
              Every occasion.
              <br />
              Every memory.
            </h2>

            <p>Your next celebration starts here.</p>
          </div>
        </aside>

        <section className="auth-form-panel">
          <Link to="/" className="auth-back-link">
            <span aria-hidden="true">‹</span> Back to home
          </Link>

          <div className="auth-form-content">
            <div className="auth-heading">
              <h1>Create an account</h1>
              <p>Start planning your unforgettable moments.</p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="auth-field">
                <label htmlFor="register-name">
                  Full name
                </label>

                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={
                    errors.fullName ? 'register-name-error' : undefined
                  }
                  required
                />

                {errors.fullName && (
                  <span
                    id="register-name-error"
                    className="auth-field-error"
                    role="alert"
                  >
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="register-email">
                  Email address
                </label>

                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'register-email-error' : undefined
                  }
                  required
                />

                {errors.email && (
                  <span
                    id="register-email-error"
                    className="auth-field-error"
                    role="alert"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="register-password">
                  Password
                </label>

                <div className="auth-password-wrapper">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create your password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? 'register-password-error' : undefined
                    }
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    aria-controls="register-password"
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />

                      {showPassword && (
                        <path d="M3 3l18 18" />
                      )}
                    </svg>
                  </button>
                </div>

                {errors.password && (
                  <span
                    id="register-password-error"
                    className="auth-field-error"
                    role="alert"
                  >
                    {errors.password}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="register-confirm-password">
                  Confirm password
                </label>

                <div className="auth-password-wrapper">
                  <input
                    id="register-confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    aria-invalid={Boolean(errors.confirmPassword)}
                    aria-describedby={
                      errors.confirmPassword
                        ? 'register-confirm-password-error'
                        : undefined
                    }
                    required
                  />

                  <button
                    type="button"
                    className="auth-password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={
                      showConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    aria-controls="register-confirm-password"
                  >
                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />

                      {showConfirmPassword && (
                        <path d="M3 3l18 18" />
                      )}
                    </svg>
                  </button>
                </div>

                {errors.confirmPassword && (
                  <span
                    id="register-confirm-password-error"
                    className="auth-field-error"
                    role="alert"
                  >
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              <button type="submit" className="auth-submit">
                Create account
              </button>

              <output className="auth-message">
                {message}
              </output>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <Link to="/login">Sign in</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
