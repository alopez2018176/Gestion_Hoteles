'use strict'

//IMPORTS
var bcrypt = require('bcrypt-nodejs')
var User =  require('../models/user')
var jwt  = require("../services/jwt")
var path = require('path')
var fs = require('fs')

function registrarUsuario(req, res){
    var user = new User();
    var params = req.body

    if(params.nombre && params.password && params.email){
        user.nombre = params.nombre
        user.usuario = params.usuario
        user.email = params.email
        user.rol = 'ROLE_USER'

        User.find({ $or: [
            {usuario: user.usuario},
            {email: user.email}
        ]}).exec((err, users) => {
            if(err) return res.status(500).send({message}).send({message: 'Error en la peticion de Usuarios'})
            if(users && users.length >= 1){
                return res.status(500).send({message: 'El Usuario ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    user.password = hash;

                    user.save((err, usuarioGuardado) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el Usuario'})
                        if(usuarioGuardado){
                            res.status(200).send({user: usuarioGuardado})
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar el Usuario'})
                        }
                    })
                })
            }
        })
    }else{
        res.status(200).send({
            message: 'Rellene todos los datos necesarios'
        })
    } 
}


function login(req, res){
    var params = req.body

    User.findOne({ email: params.email }, (err, usuario)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion' })    
    
    if(usuario){
        bcrypt.compare(params.password, usuario.password, (err, check)=>{
            if(check){
                if(params.gettoken){
                    return res.status(200).send({
                        token: jwt.createToken(usuario)
                    })
                }else{
                    usuario.password = undefined;
                    return res.status(200).send({ user: usuario })
                }
            }else{
                return res.status(404).send({ message: 'El usuario no se ha podido identificar' })
            }
        })
    }else{
        return res.status(404).send({ message: 'El usuario no se ha podido logear' })
    }
    })
}

function editarUsuario(req, res){
    var params = req.body

    delete params.password
    if(req.user.rol == 'ROLE_USER'){

        User.findByIdAndUpdate(req.user.sub, params, {new: true}, (err, userActualizado) =>{
            if(err) return res.status(500).send({ message: 'Error en la peticion' })
            if(!userActualizado) return res.status(404).send({ message: 'No se ha podido actualizar la informacion de tu cuenta' })
            return res.status(200).send({ Usuario: userActualizado })
        })
    }else{
        res.status(500).send({ message: 'No tiene los permisos para actualizar este usuario' })
    }  
}

function eliminarUsuario(req, res){
    var userId = req.params.id

    if(req.user.rol == 'ROLE_USER'){
        User.findByIdAndDelete(userId, (err, usuarioInactivo) =>{
            if(err) return res.status(500).send({ message: 'error en la peticion' })
            if(!usuarioInactivo) return res.status(404).send({ message: 'no se ha podido eliminar el usuario' })
            return res.status(200).send({ message: 'Usuario eliminado', user: usuarioInactivo })
        })
    }else{
        res.status(500).send({ message: 'No tiene los permisos para eliminar este usuario' })
    }
}



module.exports ={
    registrarUsuario,
    login,
    editarUsuario,
    eliminarUsuario
}