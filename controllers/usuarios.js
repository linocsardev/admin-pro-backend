const {response} = require('express')
const bcrypt = require('bcryptjs')

const Usuario = require('../models/usuario')
const { generarJWT } = require('../helpers/jwt')


const getUsuarios = async (req, res)=>{

    const usuarios = await Usuario.find()
    res.json({
        status: 'success',
        usuarios,
        uid: req.uid
    })
}
const createUsuario = async (req, res= response)=>{
    const {email, password, nombre, apellidos} = req.body


    try {
        const existingEmail = await Usuario.findOne({email})
        if(existingEmail){
           return  res.status(400).json({
                status: 'failure',
                message: 'Este correo ya está registrado'
            })
        }
        const usuario = new Usuario( req.body);

        //encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);
        
        //Guardar usuario   
        await usuario.save();

        //Generar un Jwt
        const token = await generarJWT(usuario.id)
    
        res.json({
            status: 'success',
            usuario,
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: 'failure',
            message: 'Error inesperado'
        })
    }
}
const updateUsuario = async (req, res)=> {
    //Validar el token de la validacion
    const uid= req.params.id 
    try {

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: "No existe el usuario con el id enviado"
            })
        } 
        //Actualización
        const { password, google, email, ...campos} = req.body;
        if(usuarioDB.email != email){

            const existeEmail = await Usuario.findOne({email: email})
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese gmail'
                })
            }
        }
        campos.email = email;
        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true})

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: "Error inesperado"
        })
    }
}
 
const deleteUsuario =   async (req, res) => {
    const uid = req.params.id
    try {
        const usuarioDB = await Usuario.findById( uid)
        if(!usuarioDB){
            return res.status(400).json({
                ok: false,
                msg: 'No existe el usuario por ese Id'
            })
        }
        await Usuario.findByIdAndDelete(uid)
        return res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error al eliminar el usuario'
        })
    }
}
module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario
}