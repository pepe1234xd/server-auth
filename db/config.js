const moongose = require("mongoose");
moongose.set('strictQuery', true);

require('dotenv').config();

const dbConnection = () => {

    moongose.connect( process.env.DB_CNN) 
    .then(() => 
        console.log( 'Database Connected' )
    ) 
    .catch((err) =>
        console.log( err )
     );
  
  }
  
  
  
  module.exports = {
  
    dbConnection
  
  }