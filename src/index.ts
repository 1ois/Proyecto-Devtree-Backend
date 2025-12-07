import server from './server'
//crear servidor

const port = process.env.PORT || 4000

server.listen(port, () => {
    console.log('Servidor funcionando', port)
})

//para no estar reiniciando de forma manual el servidor , ponemos el codigo de node --watch index.js
// para que no estar escribiendo el codigo lo agregamos en el pacjage.jsn en script
//instalamos para que cambie la forma en la que interprete node.js PS C:\Devtree> npm  i -D typescript ts-node  y ademas des
//cargo el typesctipt y su ejecutador
//me permite escribir codigo typescript y compilarlo como jvscript
//ts-node permite ler codigo typescript
//instalamos nodemon npm i -D nodemon, pense que era lo mismo que el de arriba ,pero era una version nativa y no entiende muy bien typescrip
//instalamos  npm i dotenv es una libreria que nos permite cargar variables de entorno desde un archivo env
// npm i bcrypt  esta dependecia es para hashear las contraseñas
//npm i --save-dev @types/bcrypt son para ayudar el res , req, los 3 puntitos que sale , es mas para autoayuda
//npm i slug  para sirbe para convertir versiones amigables en la URL o nombre de archivosnpm
// npm i --save-dev @types/slug Instala los tipos para TypeScrip

//instalamos el npm i express-validator