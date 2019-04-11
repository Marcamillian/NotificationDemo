// !!TODO set up the server stuff from this part in the tutorial - https://developers.google.com/web/fundamentals/push-notifications/subscribing-a-user#send_a_subscription_to_your_server

console.log("Something Server-y")

const express = require('express');
const http = require('http');


let app = express();
const serveDir = './notify-push';
let server;

app.set('port', (process.env.PORT || 8080));
app.use(express.static(serveDir));

server = http.createServer(app);

server.listen(app.get('port'), ()=>{ console.log(`listening on port ${app.get('port')}`)})
