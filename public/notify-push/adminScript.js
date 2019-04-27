function triggerNotifications(){
  fetch('/api/push-message',{
    method: 'PUT'
  })
  .then(handleFetchResponse)
  .then(()=>{
    console.log("messages sent")
  })
}

// utility functions
function handleFetchResponse(response){
  if(!response.ok){
    console.error('Bad status code from server', response.Error)
  }
  return response.json();
}