const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
// esquemas de mogoose
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    estado: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model('Categoria', categoriaSchema);