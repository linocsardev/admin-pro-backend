const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { dbConextion } = require('./database/config')

const app = express()
//configurar cors
app.use(cors())

//base de datos
dbConextion()

//rutas
app.get('/', (req, res)=> {
    res.json({
        ok: true,
        message: 'Bienvenidos a mi app'
    })
})

app.listen(process.env.PORT, ()=>{
    console.log(`Server running to port ${process.env.PORT}`)
})