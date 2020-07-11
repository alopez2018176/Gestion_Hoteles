'use strict'

//Variables Globales
const express = require("express")
const app = express()
const bodyparser = require("body-parser")

//Cargar Rutas
var user_routes = require("../src/routes/userRoutes")
var hotel_routes = require("../src/routes/hotelRoutes")
//Middlewares
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json());

//Cabeceras //Cors
app.use((req,res,next)=> {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-whith, Content-Type, Accept, Access-Control-Allow-request-Method')
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')

    next();
})

//Rutas
app.use('/api', user_routes)
app.use('/api', hotel_routes)

//Exportar
module.exports = app;
