import { User, Role } from "@prisma/client";
import { Request, Response } from "express";
import userService from "../services/user-service";
import authService from "../services/auth-service";

export default {
    register: async (req: Request, res: Response) => {
        const user = req.body;
        console.log("", user);
        if(!user.email || !user.password || !user.firstName || !user.lastName || 
            user.firstName === '' || user.lastName === '' || user.email === '' || user.password === '') {
            return res.status(401).json({ error: 'Please fill all the fields' });
        }

        const userExists = await userService.getUserByEmail(user.email);
        if(userExists) {
            return res.status(402).json({ error: 'Email taken' });
        }

        const hash = authService.hashPassword(user.password);
        user.password = hash;
        user.role = Role.USER;
        await userService.createUser({
            ...user
        });
        return res.status(201).json({ message: 'User created' });
    },

    checkIfEmailTaken: async (req: Request, res: Response) => {
        const email = req.params.email;
        const user : User | null = await userService.getUserByEmail(email);
        if(user) {
            return res.status(200).json({ message: true });
        }
        return res.status(402).json({ message: false });
    },


    login: async (req: Request, res: Response) => {
        const user = req.body as User;
        if(!user.email || !user.password || user.email === '' || user.password === '') {
            return res.status(400).json({ error: 'Please fill all the fields' });
        }

        const userExists = await userService.getUserByEmail(user.email);
        if(!userExists) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const hash = authService.hashPassword(user.password);
        if(userExists.password !== hash) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const token = authService.generateToken(userExists);
        return res.status(200).json({ token: token });
    },
}