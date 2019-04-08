function notifyMe(){

  if(!("Notification" in window)){ // are notifications supported
    alert("This browser does not support desktop notifications")
  }
  else if (Notification.permission === "granted"){  // do we already have permission
    // we can create a new one
    var notification = new Notification("Hi there!");
  }else if (Notification.permission !== "denied"){  // if they haven't been denied - ask
    Notification.requestPermission()
    .then( function(permission){
      if(permission === "granted"){ // if they said yes when we asked
        var notification = new Notification ("Hi there!");
      }
    })
  }
}