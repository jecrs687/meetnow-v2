import { User } from '@prisma/client';
import { decode, sign } from 'jsonwebtoken';

export const generateToken = (user: User) => {
    const token = sign(
        {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        process.env.JWT_SECRET || '123', {
        expiresIn: '7d',
    });
    return token;
}

type Decoded = {
    id: string,
    name: string,
    email: string,
}

export const validateToken = (token: string) => {
    const decoded = decode(token) as Decoded | undefined;
    return { decoded };
}


