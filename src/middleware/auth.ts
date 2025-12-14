import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import User, { IUser } from '../models/User'

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization

    if (!bearer) {
        const error = new Error('No autorizado')
        return res.status(401).json({ error: error.message })
    }

    const [, token] = bearer.split(' ')

    if (!token) {
        const error = new Error('No autorizado')
        return res.status(401).json({ error: error.message })
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET)
        //console.log(result)
        if (typeof result === 'object' && result.id) {
            const user = await User.findById(result.id).select('-password')
            console.log("Usuario autenticado:", user)
            //si no encuentra al usuario
            if (!user) {
                const error = new Error('El usuario no existe')
                return res.status(404).json({ error: error.message })
            }
            // res.json(user)
            req.user = user
            next()
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

//Permisos
export const authorizePermisos = (...permisosRequeridos: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user: IUser | undefined = req.user;

        if (!user) {
            return res.status(401).json({ error: 'No autorizado' });
        }

        // Verifica que al menos uno de los permisos requeridos esté en user.permisos
        const tienePermiso = permisosRequeridos.some(permiso => user.permisos.includes(permiso));

        if (!tienePermiso) {
            return res.status(403).json({ error: 'Acceso denegado: permisos insuficientes' });
        }

        next();
    };
};