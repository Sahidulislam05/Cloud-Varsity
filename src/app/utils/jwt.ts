import jwt, { type Secret } from "jsonwebtoken";

export const generateToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret as Secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = <T>(token: string, secret: string): T => {
  return jwt.verify(token, secret as Secret) as T;
};
