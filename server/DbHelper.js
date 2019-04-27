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
    return this.db.one(`
      INSERT INTO subscriptions(sub_object)
      VALUES( $1 )
      RETURNING sub_id
      `, JSON.stringify(subscriptionJSON) )
  }

  hasSubscription(subId){
    return this.db.one(`
      SELECT COUNT(1)
      FROM subscriptions
      WHERE sub_id = ${subId}
    `)
  }

  deleteSubscription(subId){
    return this.db.none(`
      DELETE
      FROM subscriptions
      WHERE sub_id = ${subId}
    `)
  }

  getAllSubscriptions(){
    return this.db.many(`
      SELECT *
      FROM subscriptions
    `)
  }

}

module.exports = { DbHelper }
