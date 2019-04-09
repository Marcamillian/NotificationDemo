console.log("Hello World")

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



let registration = registerServiceWorker();
askPermission().then(console.log)





