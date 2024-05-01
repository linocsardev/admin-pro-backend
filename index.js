const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { dbConextion } = require('./database/config')

const app = express()
//configurar cors
app.use(cors())

//Lectura y parseo del body
app.use(express.json())

//base de datos
dbConextion()

//rutas
app.use('/api/usuarios', require('./routes/usuarios'))
app.use('/api/login', require('./routes/auth'))



app.listen(process.env.PORT, ()=>{
    console.log(`Server running to port ${process.env.PORT}`)
})