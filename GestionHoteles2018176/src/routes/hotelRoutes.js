'use stric'

var express = require("express")
var HotelController = require("../controllers/hotelcontroller")
var md_auth = require("../middlewares/authenticated")

//RUTAS
var api = express.Router();
api.post('/registrarHotel', HotelController.registrarHotel)
api.post('/loginHotel', HotelController.login)
api.put('/editarHotel/:hotelId', md_auth.ensureAuth, HotelController.editarHotel)
api.get('/listarHoteles', HotelController.getInfoHoteles)
api.get('/disponibilidad', HotelController.getInfoDisponibilidad)
api.get('/ordenarPreciosAsc', HotelController.ordenarPrecioAsc)
api.get('/ordenarPrecioDesc', HotelController.ordenarPreciodesc)
module.exports = api;