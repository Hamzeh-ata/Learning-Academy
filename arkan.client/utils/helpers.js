export function getKeyByValue(object, value) {
  return Object.keys(object)?.find((key) => object[key] === value);
}
export function generateRandomCode(minLength = 12, maxLength = 12) {
  const digits = '0123456789';
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const pool = digits + letters;

  const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  const randomChar = (str) => str[Math.floor(Math.random() * str.length)];

  const code = Array.from({ length }, () => {
    const type = Math.random();
    let char = type < 0.33 ? randomChar(digits) : type < 0.67 ? randomChar(letters) : randomChar(pool).toUpperCase();
    return char;
  }).join('');

  return code;
}

export const humanizeWords = (str) => {
  if (!str) return '';
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .replace('Count', '');
};
