export const getRandomRefCode = (length) => {
  let result = '';
  let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};