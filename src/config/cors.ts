import { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
    //origin: de dónde se está enviando la petición
    origin: function (origin, callback) {

        const whiteList = [process.env.FRONTEND_URL]

        if (process.argv[2] === '--api') {
            whiteList.push(undefined)
        }

        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}


// Permitir peticiones sin 'origin' (Postman, móviles, SSR)
//         if (!origin) {
//             return callback(null, true);
//         }

//         const allowed = ['http://localhost:5173'];

//         if (allowed.includes(origin)) {
//             console.log("Conexión Permitida");
//             callback(null, true);
//         } else {
//             console.log("Conexión Denegada");
//             callback(new Error("ERROR DE CORS"));
//         }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"]

