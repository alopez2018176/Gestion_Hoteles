'use strict'

//IMPORTS
var bcrypt = require('bcrypt-nodejs')
var Hotel =  require('../models/hotel')
var jwt  = require("../services/jwt")
var path = require('path')
var fs = require('fs')

function registrarHotel(req, res){
    var hotel = new Hotel();
    var params = req.body

    if(params.nombre && params.password && params.email){
        hotel.nombre = params.nombre
        hotel.usuario = params.usuario
        hotel.email = params.email
        hotel.calificacion = params.calificacion
        hotel.precio = params.precio
        hotel.fechaDisponible = params.fechaDisponible
        hotel.rol = 'ROLE_HOTEL'

        Hotel.find({ $or: [
            {usuario: hotel.usuario},
            {email: hotel.email}
        ]}).exec((err, hoteles) => {
            if(err) return res.status(500).send({message}).send({message: 'Error en la peticion de hoteles'})
            if(hoteles && hoteles.length >= 1){
                return res.status(500).send({message: 'El Hotel ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, hash) => {
                    hotel.password = hash;

                    hotel.save((err, hotelGuardado) => {
                        if(err) return res.status(500).send({message: 'Error al guardar el Hotel'+err})
                        if(hotelGuardado){
                            res.status(200).send({Hotel: hotelGuardado})
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar el Hotel'})
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

    Hotel.findOne({ email: params.email }, (err, hotel)=>{
        if(err) return res.status(500).send({ message: 'Error en la peticion' })    
    
    if(hotel){
        bcrypt.compare(params.password, hotel.password, (err, check)=>{
            if(check){
                if(params.gettoken){
                    return res.status(200).send({
                        token: jwt.createToken(hotel)
                    })
                }else{
                    hotel.password = undefined;
                    return res.status(200).send({ Hotel: hotel })
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

function editarHotel(req, res){
    var params = req.body

    delete params.password
    if(req.user.rol == 'ROLE_HOTEL'){

        Hotel.findByIdAndUpdate(req.user.sub, params, {new: true}, (err, hotelActualizado) =>{
            if(err) return res.status(500).send({ message: 'Error en la peticion' })
            if(!hotelActualizado) return res.status(404).send({ message: 'No se ha podido actualizar la informacion del hotel' })
            return res.status(200).send({ Hotel: hotelActualizado })
        })
    }else{
        res.status(500).send({ message: 'No tiene los permisos para actualizar este usuario' })
    }  
}

function eliminarHotel(req, res){
    var hotelId = req.params.id

    if(req.user.rol == 'ROLE_HOTEL'){
        Hotel.findByIdAndDelete(hotelId, (err, hotelInactivo) =>{
            if(err) return res.status(500).send({ message: 'error en la peticion' })
            if(!hotelInactivo) return res.status(404).send({ message: 'No se ha podido cerrar el hotel' })
            return res.status(200).send({ message: 'Hotel Cerrado', user: hotelInactivo })
        })
    }else{
        res.status(500).send({ message: 'No tiene los permisos para eliminar este usuario' })
    }
}

function getInfoHoteles(req, res){
    Hotel.find({}).sort({nombre: 1}).exec((err, hotelesSolicitados) =>{
        if(err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ Hoteles: hotelesSolicitados })
    }) 
}

function getInfoDisponibilidad(req, res){
    var fecha1 = req.body.fecha1
    var fecha2 = req.body.fecha2
    Hotel.find({  fechaDisponible :  {  $gt :  fecha1  },  fechaDisponible :  {  $lt :  fecha2  },  } ,(err, hotelesDisponibles) =>{
        if(err) return res.status(500).send({ message: 'Error en la peticion' })
        return res.status(200).send({ Hoteles: hotelesDisponibles })
    }) 
}

function ordenarPrecioAsc(req,res){
    Hotel.find({}).sort({precio:1}).exec((err,Hoteles)=>{
        if(err) return res.status(500).send({message:err})
        if(!Hoteles) return res.status(404).send({message: "No fue posible ordenar los hoteles por el precio"})
        return res.status.send({Hoteles: Hoteles})
    })
}

function ordenarPreciodesc(req,res){
    Hotel.find({}).sort({precio:-1}).exec((err,Hoteles)=>{
        if(err) return res.status(500).send({message:err})
        if(!Hoteles) return res.status(404).send({message: "No fue posible ordenar los hoteles por el precio"})
        return res.status.send({Hoteles: Hoteles})
    })
}

module.exports ={
    registrarHotel,
    login,
    editarHotel,
    eliminarHotel,
    getInfoHoteles,
    getInfoDisponibilidad,
    ordenarPrecioAsc,
    ordenarPreciodesc
}