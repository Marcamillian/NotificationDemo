// !!TODO set up the server stuff from this part in the tutorial - https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#send_a_subscription_to_your_server

const express = require('express');
const http = require('http');
const { DbHelper } = require('./DbHelper');
const bodyParser = require("body-parser");
const webpush = require('web-push');

const serveDir = './public';
const dbConfig = "postgres://postgres:passopen@localhost:5433/notificationdemo";
const vapidKeys = {
  publicKey: 'BKMIRIHflfYtIPAbrtTusnePvYEHpGx8fyXpo8YNEfXi6sFegJlz_af3sqJ55i9JdT5F20J0Xv6Sd5ee79T9oqA',
  privateKey: process.env.WEB_PUSH_PRIVATE_KEY
}

webpush.setVapidDetails('mailto:marcamillian@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey)

const triggerPushMsg = function(subscription, dataToSend){
  return webpush.sendNotification(subscription.sub_object, dataToSend)
  .catch( err =>{
    if(err.statisCode === 410){
      return dbHelper.deleteSubscription(subscription.sub_id)
    }else{
      console.log('Subscription no longer valid:', err)
    }
  })
}


// Server set up
let app = express();
let server;
let dbHelper = new DbHelper(dbConfig);

app.set('port', (process.env.PORT || 8080));
app.use( bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json() )
app.use(express.static(serveDir));

// server REST endpoints
app.get('/api/subscription/:id', function(req,res){
  let subId = req.params.id;

  dbHelper.hasSubscription(subId)
  .then( dbResult =>{
    if( dbResult.count == 1 ){
      res.setHeader('Content-Type', 'application/json');
      res.send( JSON.stringify({ data: { success: true } }) )
    }else{
      throw new Error(`Couldn't find subscription ${subId}`)
    }
  })
  .catch( error =>{
    console.error( "id not present" );
    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify({ data: { success: false } }) )
  })
})

app.post('/api/subscription/', function(req, res){

  dbHelper.saveSubscription(req.body)
  .then( ({ sub_id })=>{
    
    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify({ data: { success: true, id: sub_id } }) )
  })
  .catch( error =>{

    console.error( error );
    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify({ data: { success: false } }) )
  })
  
  /* !TODO - write the is valid check
  if(!isValidSaveRequest(req, res)){
    return;
  }
  */

  /*  !TODO - fill in database helper before we can use this
  return saveSubscriptionToDatabase(req.body) // TODO: Set up this database call
  .then( (subscriptionId)=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success: true } }))
  })
  .catch( err =>{
    res.status(500);
    res.setHeader('Content-Type', 'applcation/json');
    res.send( JSON.stringify({
      error:{
        id: 'unable-to-save-subscription',
        message: 'The subscription was recieved but we were unable to save it to our database'
      }
    }))
  })
  */

})

app.delete('/api/subscription/:id', function(req, res){
  let subId = req.params.id;

  //!TODO delete subscription from database
  dbHelper.deleteSubscription(subId)
  .then( dbResult =>{
    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify({ data:{ success: true } }))
  })
  .catch( error =>{
    console.error(`id not present: ${subId}`)
    res.setHeader('Content-Type', 'application/json');
    res.send( JSON.stringify({ data: {success: false } }))
  })
})

app.put('/api/push-message', function(req, res){
  
  dbHelper.getAllSubscriptions()
  .then( subscriptionArray =>{
    let promiseChain = Promise.resolve();

    subscriptionArray.forEach(( subscription )=>{
      promiseChain = promiseChain.then(()=>{
        return triggerPushMsg(subscription, "something")
      })
    })
  })
  .then( ()=>{
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ data: { success:true }}))
  })
  .catch( err =>{
    res.status(500)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({
      error:{
        id:'unable-to-send-messages',
        message: 'We were unable to send messages to all subscriptions'
      }
    }))
  })
})


// init server
server = http.createServer(app);

server.listen(app.get('port'), ()=>{ console.log(`listening on port ${app.get('port')}`)})
