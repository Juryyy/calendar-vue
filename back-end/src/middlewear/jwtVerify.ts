import { NextFunction, Request, Response } from "express";
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import  config  from '../config';
import { User, Role } from "@prisma/client";

const jwtVerifyUser = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, config.jwtConfig.secret as Secret);
            req.user = decoded as User;
            next(); 
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" }); 
        }
    } else {
        res.status(401).json({ message: "No token provided" }); 
    }
}

const jwtVerifyAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        try {
            const decoded = jwt.verify(token, config.jwtConfig.secret as Secret);
            const user = decoded as User;
            if (user.role === Role.ADMIN) {
                req.user = user;
                next();
            } else {
                res.status(403).json({ message: "Access denied. Admin privileges required." });
            }
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired token" });
        }
    } else {
        res.status(401).json({ message: "No token provided" });
    }
}

export {jwtVerifyUser, jwtVerifyAdmin};