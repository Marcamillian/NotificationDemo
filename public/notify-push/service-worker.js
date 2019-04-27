'use strict'

self.addEventListener('push', function(event){
  console.log('recieved a push message', event)

  var title = "Yay a message";
  var body = "We have recieved a push message";
  var tag = `simple-push-demo-notification-tag`;

  event.waitUntil(
    self.registration.showNotification(title,{
      body: body,
      tag: tag
    })
  )
})

self.addEventListener('notificationClick', function(event){
  console.log('On notification click', event.notification.tag);
  event.notification.close()

  event.waitUntil(clients.matchAll({
    type: 'window'
  }).then( clientList =>{
    for (var i=0; i < clientList.length; i++){
      var client = clientList[i]
      if(client.url === '/' && 'focus' in client){
        return client.focus()
      }
    }
    if(clients.openwindow){
      return clients.openWindow('/')
    }
  }))

})

