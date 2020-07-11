'use stric'

var express = require("express")
var UserController = require("../controllers/userController")
var md_auth = require("../middlewares/authenticated")



//RUTAS
var api = express.Router();
api.post('/registrarUsuario', UserController.registrarUsuario)
api.post('/loginUser', UserController.login)
api.put('/editarUsuario/:userId', md_auth.ensureAuth, UserController.editarUsuario)
api.delete('/eliminarCuenta/:userId', md_auth.ensureAuth, UserController.eliminarUsuario)


module.exports = api;