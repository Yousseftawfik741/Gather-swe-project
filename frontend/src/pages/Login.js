
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { isValidEmail } from '../utils/validation';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = {};

    if (!email.trim()) {
      validationErrors.email = 'Please enter your email address.';
    } else if (!isValidEmail(email)) {
      validationErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      validationErrors.password = 'Please enter your password.';
    }

    setErrors(validationErrors);
    setMessage('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setMessage('Sign-in is not available yet. Please try again later.');
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
              <h1>Welcome back</h1>
              <p>Sign in to continue planning.</p>
            </div>

            <form
              className="auth-form"
              onSubmit={handleSubmit}
              noValidate
            >
              <div className="auth-field">
                <label htmlFor="login-email">
                  Email address
                </label>

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? 'login-email-error' : undefined
                  }
                  required
                />

                {errors.email && (
                  <span
                    id="login-email-error"
                    className="auth-field-error"
                    role="alert"
                  >
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="auth-field">
                <label htmlFor="login-password">
                  Password
                </label>

                <div className="auth-password-wrapper">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={
                      errors.password ? 'login-password-error' : undefined
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
                    aria-controls="login-password"
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
                    id="login-password-error"
                    className="auth-field-error"
                    role="alert"
                  >
                    {errors.password}
                  </span>
                )}
              </div>

              <button type="submit" className="auth-submit">
                Sign in
              </button>

              <output className="auth-message">
                {message}
              </output>
            </form>

            <p className="auth-switch">
              New to Gather?{' '}
              <Link to="/register">Create an account</Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
