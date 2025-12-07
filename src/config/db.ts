import mongoose from "mongoose"

console.log(process.env)

export const connectDB = async () => {
    try {
        // const url = ''
        const connection = await mongoose.connect(process.env.MONGO_URI)

        // console.log(connection)
        console.log('conectadorMongoDBssss')
        const url2 = '${connection.host}:${connection.port}'
    } catch (error) {
        console.log(error.message)
        process.exit(1)//terminar ejecucion del programa
    }
}