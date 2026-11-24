
export function isValidEmail(email) {
  const normalizedEmail = email.trim();
  const emailInput = document.createElement('input');

  emailInput.type = 'email';
  emailInput.value = normalizedEmail;

  if (!normalizedEmail || emailInput.validity.typeMismatch) {
    return false;
  }

  const domain = normalizedEmail.split('@')[1];

  if (!domain?.includes('.')) {
    return false;
  }

  return domain.split('.').every((part) => part.length > 0);
}
