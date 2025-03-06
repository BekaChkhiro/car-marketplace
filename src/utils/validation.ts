export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('პაროლი უნდა შეიცავდეს მინიმუმ ერთ დიდ ასოს');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('პაროლი უნდა შეიცავდეს მინიმუმ ერთ პატარა ასოს');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('პაროლი უნდა შეიცავდეს მინიმუმ ერთ ციფრს');
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('პაროლი უნდა შეიცავდეს მინიმუმ ერთ სპეციალურ სიმბოლოს (!@#$%^&*)');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};