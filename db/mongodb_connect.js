let mongoose = require('mongoose'); //ODM  = object data model
let config = require('./config.js');

console.log(config.getUrl());

mongoose.connect(config.getUrl(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
}).then(()=>console.log("Conectado a la base de datos"))
  .catch((err)=>console.log("no conectado", err))

  
module.exports = mongoose;

