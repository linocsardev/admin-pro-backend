const mongoose = require('mongoose');
const dbConextion = async ()=> {
    try {
        await  mongoose.connect(process.env.DB_CNN, {
         });
         console.log("DB on line !!!")
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar los logs')
    }
}

module.exports = {
    dbConextion
}