export const calculatePasswordStrength = (password) => {
  if (!password) return { strength: 0, label: '', percentage: 0, checks: {} };

  let strength = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  Object.values(checks).forEach((check) => {
    if (check) strength++;
  });

  const percentage = (strength / 5) * 100;
  
  let label = '';
  let color = '';
  if (strength <= 1) {
    label = 'Very Weak';
    color = 'red';
  } else if (strength === 2) {
    label = 'Weak';
    color = 'orange';
  } else if (strength === 3) {
    label = 'Fair';
    color = 'yellow';
  } else if (strength === 4) {
    label = 'Good';
    color = 'blue';
  } else {
    label = 'Strong';
    color = 'green';
  }

  return { strength, label, percentage, checks, color };
};
