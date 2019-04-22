let pushSub;
const serverSubUrl = '/api/subscription/';


// check if browser supports things
if(!('serviceWorker' in navigator)){
  alert("Service worker isn't supported")
}

if(!('PushManager' in window)){
  alert("Push notifications arn't supported")
}

function registerServiceWorker(){
  return navigator.serviceWorker.register('./service-worker.js')
  .then( function(registration){
    console.log("Service worker registered successfully");
    return registration;
  })
  .catch( function(err){
    console.error("Unable to register service worker", err)
  })
}

function askPermission(){

  // return our own promise
  return new Promise(function(resolve,reject){

    // pass callback that resolves the promise - in case it needs a callback
    const permissionResult = Notification.requestPermission( function(result){
      resolve(result);
    })

    // if a promise returned - resolve the promise with the functions in our outer promise
    if (permissionResult){
      permissionResult.then(resolve, reject)
    }
  })
  // should recieve the users response to permission request
  .then(function(permissionResult){
    if(permissionResult !== 'granted'){
      throw new Error('We weren\'t granted permission')
    }
    return permissionResult;
  })
}


function subscribeUserToPush(){
  return navigator.serviceWorker.register('./service-worker.js')
  .then(function(registration){
    const subscribeOptions ={
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        'BKMIRIHflfYtIPAbrtTusnePvYEHpGx8fyXpo8YNEfXi6sFegJlz_af3sqJ55i9JdT5F20J0Xv6Sd5ee79T9oqA'
      )
    };

    return registration.pushManager.subscribe(subscribeOptions)
  })
  .then(function(pushSubscription){
    console.log('Recieved PushSubscription:', JSON.stringify(pushSubscription))
    return pushSubscription;
  })
}

// server requests
function checkSignalId(){
  const signalId = getCookieObject().signal_id || "none"
  if(signalId != undefined){
    // check that server knows we are subscribed
    return fetch(`${serverSubUrl}${signalId}`)
    .then( handleFetchResponse )
    .then( (responseJSON)=>{
      if( !(responseJSON.data && responseJSON.data.success)){
        console.log("subscription not found on server")
        return false
      }else{
        console.log("is subscribed")
        return true
      }
    })
  }
}

function sendSubscriptionToBackEnd(subscription){
  return fetch(serverSubUrl,{
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then( handleFetchResponse )
  .then(function(response){
    if(!(response.data && response.data.success)){
      throw new Error("Couldn't save subscription")
    }else{
      return response.data
    }
  });
}

function removeSubscription(subId){
  const signalId = getCookieObject().signal_id || "none";
  return fetch(`${serverSubUrl}${signalId}`,{
    method: 'DELETE'
  })
  .then(handleFetchResponse)
  .then(function(response){
    if(!(response.data && response.data.success)){
      throw new Error("Couldn't delete subscription")
    }else{
      console.log("unsubscribed")
      removeSignalId()
    }
  })
}

// utility functions
function handleFetchResponse(response){
  if(!response.ok){
    console.error('Bad status code from server', response.Error)
  }
  return response.json();
}


function setSignalId({ id }){
  document.cookie = `signal_id=${ id }`
}

function removeSignalId(){
  document.cookie=`signal_id=; Max-Age=-9999999`
}

function getCookieObject(){

  let cookieObject = {}
  document.cookie.split(";")
  .forEach( cookie =>{
    
    let pair = cookie.split("=")
    
    cookieObject[pair[0]] = pair[1]
    
  })

  return cookieObject
}


function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


// == implemention

function setNotifications(){
  return askPermission()
  .then( ()=>{
    return subscribeUserToPush()
  })
  .then( sendSubscriptionToBackEnd )
  .then( setSignalId )
}

function toggleNotification(){
  let toggleButton = document.querySelector('toggle-button')
  if( toggleButton.getState() == false){
    setNotifications()
  }else{
    removeSubscription()
  }
}

// set the inital state of the button
checkSignalId()
.then( success =>{
  if (success){
    document.querySelector('toggle-button').setState(success)
  }
})

//let registration = registerServiceWorker();




