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

  saveSubscription(subscriptionJSON){
    return this.db.none('INSERT INTO subscriptions(sub_object) VALUES( $1 )', JSON.stringify(subscriptionJSON) )
  }

}

module.exports = { DbHelper }
