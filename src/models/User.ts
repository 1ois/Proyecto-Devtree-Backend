import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
    handle: string,
    name: string
    email: string
    password: string
    description: string
    image: string
    links: string
    permisos: [string]

}
const userShema = new Schema({
    //atributos del usuario
    handle: {
        type: String,
        required: true,
        trin: true,
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true// es una funcion para quitar espacios en blanco
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    links: {
        type: String,
        default: '[]'
    },
    permisos: {
        type: [String],
        default: ['base']

    }
})
//agrege INICIO 
export interface Ivisites extends Document {
    total: number;
}
const VisitasShema = new Schema({
    total: {
        type: Number,
        default: 0
    }
})
// AGREGE FIN

//create el modelo
const visitasModel = mongoose.model<Ivisites>("Visitas", VisitasShema)
const UserModel = mongoose.model<IUser>('User', userShema)
export default UserModel;

//Agrege
export { visitasModel };