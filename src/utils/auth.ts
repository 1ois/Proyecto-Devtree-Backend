import bcrypt from 'bcrypt'



export const hashPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(10) //10 rondas
    return await bcrypt.hash(password, salt)
}
//Funcion para comprobar el password

export const checkPassword = async (enteredPassword: string, hash: string) => {
    // console.log(enteredPassword)
    //console.log(hash)
    return await bcrypt.compare(enteredPassword, hash)
}

//1 salt es una cadena de caracteres aleatoias
//Pass: 12 456
//pepito: jkhsjkhajkhdkjsa89797981121
//maria: siaudiuoadioas08121212129 919
//El propósito de un salt es aumentar la seguridad que los hash sean úni os
//incluso si las contraseñas son igu les
//Las rondas se refieren a un número de veces que se va a aplicar la función de ash
//10 es el valor por default que se coloca en los proye