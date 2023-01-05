const express = require('express');
const cors = require('cors');
const path = require('path');

//variables de entorno
require('dotenv').config();

//crear el servidor de express
const app = express();
const v1 = require('./routes/auth');
const { dbConnection } = require('./db/config');

//base de datos
dbConnection();

//directorio publico
app.use(express.static('public'));

//cors
app.use(cors());

//middleweres para lectura y pase del body
app.use(express.json());

//rutas
app.use('/api/auth',v1);

//manejar todas las rutas
// app.get('*',(req, resp)=>{
//     resp.sendFile(path.resolve(__dirname,'public/index.html'))
// })
//en el front hice un has para permitir las rutas


//peticion get
app.get('/',(req,resp)=>{
    resp.json({
        ok:true,
        msg:'todo gud',
        uid:123
    })
});

app.listen(process.env.port, ()=>{
    console.log(`servidor corriendo en puerto ${process.env.port}`)
});