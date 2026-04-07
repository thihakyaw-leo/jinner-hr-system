import type { MiddlewareHandler } from 'hono';
import { jwt } from 'hono/jwt';
import type { AppEnv } from '../types';

export const jwtAuth: MiddlewareHandler<AppEnv> = async (c, next) => {
  const middleware = jwt({ secret: c.env.JWT_SECRET, alg: 'HS256' });
  return middleware(c, next);
};
