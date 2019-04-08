function notifyMe(){

  const notifyContents = {
    icon:"./notify-icon.png",
    title:"Hello There",
    body:"Thankyou for looking at this message"
  }

  if(!("Notification" in window)){ // are notifications supported
    alert("This browser does not support desktop notifications")
  }
  else if (Notification.permission === "granted"){  // do we already have permission
    // we can create a new one
    spawnNotification( notifyContents )
  }else if (Notification.permission !== "denied"){  // if they haven't been denied - ask
    Notification.requestPermission()
    .then( function(permission){
      if(permission === "granted"){ // if they said yes when we asked
        spawnNotification( notifyContents )
      }
    })
  }
}

function spawnNotification({body, icon, title}){
  var n = new Notification(title, {icon, body})
}