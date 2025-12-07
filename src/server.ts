import express from 'express' //Modules
import cors from 'cors'
import 'dotenv/config'
//const express = require('express')
import router from './router'
import { connectDB } from './config/db'
import { corsConfig } from './config/cors'


//intacia del servidor 
const app = express()

connectDB()
app.use(cors(corsConfig));
//Ler datos del formulario
app.use(express.json())//queremos habilitar la lectura de datos con el express.json

//Cors:MIDDLEWARE GLOBAL



app.use('/', router)//cada vez que hay una peticion a la URL principal se ejecuta a router

export default app