const PASSWORD_MIN_LENGTH = 8;
const UPPERCASE_PATTERN = /[A-Z]/;
const NUMBER_PATTERN = /\d/;
const SYMBOL_PATTERN = /[^A-Za-z0-9]/;

export const PASSWORD_REQUIREMENTS_MESSAGE =
  "Password must be at least 8 characters and include at least one uppercase letter, one number, and one symbol.";

export function validatePasswordStrength(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: PASSWORD_REQUIREMENTS_MESSAGE,
    };
  }

  if (!UPPERCASE_PATTERN.test(password)) {
    return {
      isValid: false,
      error: PASSWORD_REQUIREMENTS_MESSAGE,
    };
  }

  if (!NUMBER_PATTERN.test(password)) {
    return {
      isValid: false,
      error: PASSWORD_REQUIREMENTS_MESSAGE,
    };
  }

  if (!SYMBOL_PATTERN.test(password)) {
    return {
      isValid: false,
      error: PASSWORD_REQUIREMENTS_MESSAGE,
    };
  }

  return { isValid: true };
}