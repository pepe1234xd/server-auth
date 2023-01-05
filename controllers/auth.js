const{ response } = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req,resp=response)=>{

    const {email, name, password} = req.body;

    try{

    //verificar email
        const usuario = await Usuario.findOne({email});

        if(usuario){
            return resp.status(400).json({
                ok:false,
                msg:'Este correo ya esta en uso'
            })
        }
    //crear usaruio con el modelo
    const dbUser = new Usuario(req.body);
    
    //hashear la contrasenia
    const salt = bcrypt.genSaltSync();
    dbUser.password = bcrypt.hashSync(password, salt);
    //generar el JWT 
    const token = await generarJWT(dbUser.id, name);
    //crear usarui de DB
    dbUser.save();

    //generar respuesta
    return resp.status(201).json({
        ok:true,
        uid:dbUser.id,
        name,
        email,
        token
    });

    } catch(error){
        return resp.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
    
}

const loginUsuario = async (req,resp)=>{

    const {email, password} = req.body

    try{
    
    const dbUser = await Usuario.findOne({email});

    if(!dbUser){
        return resp.status(400).json({
            ok:false,
            msg: 'El correo o la contrasenia no existen'
        })
    }

    //confirmar si el password hace match
    const validPassword = bcrypt.compareSync(password, dbUser.password)

    if(!validPassword){
        return resp.status(400).json({
            ok:false,
            msg: 'El correo o la contrasenia no existen'
        })
    }

    //generar jwt
    const token = await generarJWT(dbUser.id, dbUser.name);

    //respuesta final
    return resp.json({
        ok:true,
        uid:dbUser.id,
        name: dbUser.name,
        token,
        email:dbUser.email
    })

    }catch(error){
        return resp.status(500).json({
            ok:false,
            msg:'Por favor hable con el administrador'
        })
    }
}

const revalidarToken= async (req,resp)=>{

    const {uid}= req;

    //leer la base de datos para obtener el usuario
    const dbUser = await Usuario.findById(uid)

    //generar jwt
    const token = await generarJWT(uid, dbUser.name);

    return resp.json({
        ok:true,
        uid,
        name:dbUser.name,
        token,
        email: dbUser.email
    });
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}