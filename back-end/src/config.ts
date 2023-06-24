import { Params } from 'express-jwt'
import { User } from "@prisma/client";

declare module "express" {
  interface Request {
    user?: User;
  }
}

export default {
    allowedFrontendOrigin: 'http://localhost:3000',
    jwtConfig: {
        secret: 'viv99vfd9vdf09',
        algorithms: ['HS256'] as Params['algorithms'],
    },
    passwordConfig: {
        salt: 'faacdcojirj90990',
        iterations: 1000,
        keylen: 64,
        digest: 'sha512',
    },
};