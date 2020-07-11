'use stric'

var mongoose = require("mongoose")
var Schema = mongoose.Schema;

var HotelSchema = Schema({
    nombre: String,
    usuario: String,
    email: String,
    password: String,
    rol: String,
    calificacion: Number,
    precio: String,
    fechaDisponible: Date

})

module.exports = mongoose.model('hotel', HotelSchema);