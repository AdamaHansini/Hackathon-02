import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (userId, role = 'user') => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const verifyToken = (token) => {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured.');
  return jwt.verify(token, JWT_SECRET);
};
