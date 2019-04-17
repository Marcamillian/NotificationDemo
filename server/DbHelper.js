const pgp = require('pg-promise')();

class DbHelper {
  
  constructor( connectionConfig ){

    this.db = pgp( connectionConfig )
    
    this.db.connect()
    .then(()=>{
      console.log("connected to database")
    })
    .catch( error =>{
      console.error("Coudln't connect to database")
      console.error(error)
    })
      
  }

}

module.exports = { DbHelper }
