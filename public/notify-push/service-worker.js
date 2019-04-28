'use strict'
let actionUrls = {};


self.addEventListener('install', (event)=>{
  console.log("Service worker install")
})

self.addEventListener('activate', (event)=>{
  console.log("Service worker activated")
})

self.addEventListener('push', function(event){
  
  let payload = event.data ? JSON.parse(event.data.text()) : 'no data on push';
  let {title, body, tag, actions, defaultLink} = payload;

  actionUrls['default'] = defaultLink || '/notify-push/'

  actions.forEach( action =>{
    if(action.url){
      actionUrls[action.action] = action.url
    }
  })

  event.waitUntil(
    self.registration.showNotification(title,{
      body,
      tag,
      actions
    })
  )
})

self.addEventListener('notificationclick', function(event){

  switch( event.action ){
    case 'link':
      event.notification.close()
      clients.openWindow( actionUrls[ event.action ] )
    break;
    case 'dismiss':
      event.notification.close()
    break;
    default: // if actions aren't supported
      clients.openWindow(actionUrls['default'])
      
    break;
  }

  /*
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
  */

})

