const express = require('express');
const Categoria = require('../models/categoria');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();
//jhk

//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({ estado: true })
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            //regresar el objeto
            res.json({
                ok: true,
                categorias
            });

        });
});

//Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, { estado: true })
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            if (!categorias) {
                return res.status(500).json({
                    ok: false,
                    err: {
                        message: "El id no es correcto"
                    }
                });
            }
            //regresar el objeto
            Categoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias
                });
            });
        });
});

//Crear nueva categorias
app.post('/categoria', verificaToken, (req, res) => {
    // regresar nueva categoria
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

//Actualizar categorias
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        nombre: body.nombre
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});
//Crear nueva categorias
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // condiciones: solo admin debe borrar las categorias
    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Categoria.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, categoriaBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrado) {
            return res, status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrado
        });
    });
});

module.exports = app;