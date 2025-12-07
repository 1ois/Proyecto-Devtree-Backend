// crear el jwt y validarlo 

import jwt, { JwtPayload } from "jsonwebtoken"


export const generateJWT = (payload: JwtPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
        //duracion de jwt, 1d =1dia
    })
    return token
    //  console.log(payload)
}