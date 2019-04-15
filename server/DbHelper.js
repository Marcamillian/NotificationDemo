const pgp = require('pg-promise')();

class DBHelper {
  
  constructor(){

    this.db = new pgp({
      host:"localhost",
      port: 5432,
      database: "notification-demo",
      user: "postgres",
      password: "passopen"
    })
    
    this.db.connect()
  }

}

module.exports = DbHelper;