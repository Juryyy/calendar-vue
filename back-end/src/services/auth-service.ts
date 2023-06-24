import { User } from '@prisma/client';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import config from '../config';
import crypto from "crypto";


export default{
    generateToken: (user: User) => {
        const tokenPayload = {
            ...user
        };
        return jwt.sign(
            tokenPayload as object,
            config.jwtConfig.secret as Secret,
            {
                algorithm: config.jwtConfig.algorithms[0]
            }
        );
    },

    hashPassword: (password: string) => {
        return crypto.pbkdf2Sync(
            password,
            config.passwordConfig.salt as string,
            config.passwordConfig.iterations as number,
            config.passwordConfig.keylen as number,
            config.passwordConfig.digest as string
        ).toString('hex');
    }
}