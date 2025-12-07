import { Router } from 'express'
import { body } from 'express-validator'

import User from './models/User'
//Permite configuar un objeto con todas las rutas que despues podemos agregar a la app principal server.ts

import { aumentarVisitas, createAccount, getUser, getUserByHandle, getVisitas, login, searchByHandle, updateProfile, uploadImage } from './handlers'
import { handleInputErrors } from './middleware/validation'
import { authenticate } from './middleware/auth'
const router = Router()

//Autenticacion y Registro
router.post('/auth/register',
    body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
    body('name').notEmpty().withMessage('El nombre no puede ir vacio'),
    body('email').isEmail().withMessage('Email no valido'),
    body('password').isLength({ min: 8 }).withMessage('El passowrd es muy corto,minimo 8 caracteres'),
    handleInputErrors,
    createAccount)

router.post('/auth/login',
    body('email').isEmail().withMessage('Email no valido'),
    body('password').notEmpty().withMessage('El passowrd es muy corto,minimo 8 caracteres'),

    login)

router.get('/user', authenticate, getUser)

//actualizamos un regsitro en la BD: put y patch
//put : Crea un nuevo elemento o reemplaza una representacion del elemento de destino con los datos de la peticion
//patch: aplica modificaion parciales a un recurso (seria mejor porque soilo vamosa  cambiar el handle y su descripcion)

//para modificar un usuario necesitamos que este autenticado por eso el autehtnclate

router.patch('/user',
    body('handle').notEmpty().withMessage('El handle no puede ir vacio'),
    body('description').notEmpty().withMessage('La descripcion no puede ir vacia'),
    //el middleware
    handleInputErrors,
    authenticate,
    updateProfile)

router.post('/user/image', authenticate, uploadImage)

router.post('/search',
    body('handle').notEmpty().withMessage('El handle no puedo  ir vacio'),
    handleInputErrors,
    searchByHandle
)
//router dinamico
router.get('/:handle', getUserByHandle)

//Agregare el router para visitas

//GET obtener total de visitas
router.get('/', getVisitas)

//POST sumar visitas

router.post('/sumarVisitas', aumentarVisitas)


export default router


//Routing
/*router.get('/', (req, res) => {
    res.send('Hola mundo desde Express')
    //request (envia informacion , url que se esta visitando)- response(la informacion que regresa)
})

router.get('/ecomerce', (req, res) => {
    res.send('Este es el Ecomerce')
})
router.get('/ecomerce2', (req, res) => {
    res.send('Este es el Ecomerce2')
})*/
