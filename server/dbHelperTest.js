const { DbHelper } = require('./DbHelper');

connectionConfig = "postgres://postgres:passopen@localhost:5433/notificationdemo";

let dbHelper = new DbHelper(connectionConfig);



dbHelper.deleteSubscription( 45 )
.then((responseThing)=>{
  console.log(responseThing)
  console.log("Delete something from the database")
})
.catch(console.error)
