export const RandomNumberGenerator = (): number => {
  const min = 100000; // The minimum 6-digit number (inclusive)
  const max = 999999; // The maximum 6-digit number (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
