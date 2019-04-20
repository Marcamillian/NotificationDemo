const { DbHelper } = require('./DbHelper');

connectionConfig = "postgres://postgres:passopen@localhost:5433/notificationdemo";

let dbHelper = new DbHelper(connectionConfig);


let dummySubscription = {
  endpoint:"https://fcm.googleapis.com/fcm/send/something",
  expirationTime:null,
  keys:{
    p256dh:"somekey",
    auth:"someOtherKey"
  }
}


dbHelper.saveSubscription( dummySubscription )
.then(()=>{
  console.log("Put soemthing in the database")
})
.catch(console.error)
