const jwt = require('jsonwebtoken');

const validarJWT=(req, resp, next)=>{

    const token = req.header('x-token');

    if(!token){
        return resp.status(401).json({
            ok:false,
            msg:'error en la validacion'
        })
    }

    try {
        
        const {uid, name}=jwt.verify(token, process.env.SECRET_JWT_SEED);
        req.uid = uid;
        req.name = name;
        
    } catch (error) {
       return resp.status(401).json({
        ok:false,
        msg:'error en la validacion'
        })
    }
    next();
}

module.exports={
    validarJWT
}