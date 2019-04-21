let pushSub;
const serverSubSaveUrl = '/api/save-subscription/';

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

// Notification.requestPermission was changed to return a promise (rather than take a callback) - this handles both implementations
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

function sendSubscriptionToBackEnd(subscription){
  return fetch(serverSubSaveUrl,{
    method: 'POST',
    headers:{
      'Content-Type':'application/json'
    },
    body: JSON.stringify(subscription)
  })
  .then(function(response){
    if(!response.ok){
      throw new Error('Bad status code from server')
    }

    return response.json();
  })
  .then(function(response){
    if(!(response.data && response.data.success)){
      throw new Error('Bad response from server')
    }else{
      console.log("Request successful")
    }
  });
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


//let registration = registerServiceWorker();

/*
askPermission()
.then( ()=>{
  return subscribeUserToPush()
})
.then( sendSubscriptionToBackEnd )
*/




