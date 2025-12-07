//agregamos el funcion se encarga el tipo de preticcion
import { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import User, { visitasModel } from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import slug from 'slug'
import { v4 as uuid } from 'uuid'
import { generateJWT } from '../utils/jwt'
import formidable from 'formidable'
import cloudinary from '../config/cloudinary'





export const createAccount = async (req: Request, res: Response) => {



    const { email, password, handle } = req.body

    const userExists = await User.findOne({ email })//findOne es como un where en bd relacion
    //Otra forma de saber si existe un duplicado de email pero en formato json
    if (userExists) {
        const error = new Error('El usaurio ya esta registrado')
        //se le agrega status() al estado para cambiarlo en el postman
        return res.status(409).json({ error: error.message })

    }

    const user = new User(req.body)

    //encriptamos la contraseña
    user.password = await hashPassword(password)
    console.log(slug(handle, ''))


    await user.save()

    res.status(201).send('Registro Creadossss')


}

export const login = async (req: Request, res: Response) => {
    //console.log("Desde login....")
    //Manejo de errores
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { email, password } = req.body

    const user = await User.findOne({ email })//findOne es como un where en bd relacion
    //Otra forma de saber si existe un duplicado de email pero en formato json
    if (!user) {
        const error = new Error('El usaurio no existe')
        //se le agrega status() al estado para cambiarlo en el postman
        return res.status(404).json({ error: error.message })

    }
    //comprobar el password
    // console.log(user.password)
    // checkPassword(password, user.password)

    const inPasswordCorrect = await checkPassword(password, user.password)

    if (!inPasswordCorrect) {
        const error = new Error('Password incorrecto')
        //se le agrega status() al estado para cambiarlo en el postman
        return res.status(401).json({ error: error.message })
        //401:porque noe sta autorizado a acceder al recurso

    }
    // res.send('Autenticado...')
    // hasta qui tenemos un usuario que ingreso correctamente , entonces
    const token = generateJWT({ id: user._id })
    res.send(token)



}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        //console.log(req.body)
        const { description, links } = req.body
        //copiamos de arriba: esto porque el usuario no puede utilizar un usuario que esta utilizando otra persona
        const handle = slug(req.body.handle, '')
        const handleExists = await User.findOne({ handle })

        // Si existe Y no es el mismo usuario → error
        if (handleExists && handleExists.email !== req.user.email) {
            const error = new Error('Nombre de usuario no disponiblssss')
            return res.status(409).json({ error: error.message })
        }

        //Actualziar el ususario

        req.user.description = description
        req.user.handle = handle
        req.user.links = links
        // IMPORTANTE: guardar cambios si es mongoose
        await req.user.save()

        // IMPORTANTE: enviar una respuesta
        return res.json("Perfil actualizado correctamente")




    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })

    }
}

export const uploadImage = async (req: Request, res: Response) => {

    const form = formidable({ multiples: false })//porque solo subiremos una iamgen
    form.parse(req, (error, fields, files) => {
        // console.log(files.file) //para que no tenga que acceder al objeto
        cloudinary.uploader.upload(files.file[0].filepath, { public_id: uuid() }, async function (error, result) {
            //va a ser async porque va a interactuar con la api o cloudinary
            //console.log(error)
            //console.log(result)
            if (error) {
                const error = new Error("Hubo un error al subir la imagen")
                return res.status(500).json({ error: error.message })
            }
            if (result) {
                req.user.image = result.secure_url
                await req.user.save()
                res.json({ image: result.secure_url })
                // console.log(result.secure_url)
            }
        })
    })
    try {

        return console.log("Desde uplaodImage")
    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }

}
export const searchByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.body
        const userExists = await User.findOne({ handle })
        if (userExists) {
            const error = new Error(`${handle} ya esta registrado`)
            return res.status(409).json({ error: error.message })
        }
        res.send(`${handle} esta disponible`)
    }
    catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }


}
export const getUserByHandle = async (req: Request, res: Response) => {
    try {
        const { handle } = req.params
        //traemos todos los dastos del user  ,pero menos id, v , emaill y password
        const user = await User.findOne({ handle }).select('-_id -__v -email -password')
        //console.log({ user })
        if (!user) {
            const error = new Error('El usuario no esxite')
            return res.status(404).json({ error: error.message })
        }
        return res.json(user)

    } catch (e) {
        const error = new Error("Hubo un error")
        return res.status(500).json({ error: error.message })
    }
}

//Obtenemos la cantidad de visitas

export const getVisitas = async (req: Request, res: Response) => {
    try {
        const registro = await visitasModel.findOne();
        //si no existe, crear uno
        if (!registro) {
            const nuevo = await visitasModel.create({ total: 1 });
            return res.json(nuevo);
        }
        return res.json(registro)


    } catch (error) {
        res.status(500).json({ message: "ERROR al obtener visitas" });

    }
};
//suamr 1 visita
export const aumentarVisitas = async (req: Request, res: Response) => {
    try {

        let registro = await visitasModel.findOne();

        if (!registro) {
            registro = await visitasModel.create({ total: 1 });
        } else {
            registro.total += 1;
            await registro.save()

        }
        res.json(registro)
        console.log(registro)

    } catch (error) {
        res.status(500).json({ message: "ERROR AL AUMENTAR VISITAS" });

    }
}











//console.log(req.body)
//await User.create(req.body)

/* if (userExists) {
       console.log('Si existe')
   } else { console.log("No existe") }
*/
//Otra forma de agregar datos/instanciar el modelo Use:


/*
        // hash contraseña
        const hash = await hashPassword(password)
        console.log(hash)*/