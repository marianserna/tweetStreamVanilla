`npm init`
`npm install express --save`

index.js
```
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// Middleware: Search for static files in the public folder
app.use(express.static('public'));

io.on('connection', (clientConnection) => {
  // flow: clientConnection emits search event. Server listens for hashtag event and emits tweet events
  clientConnection.on('search', (search) => {
    console.log(search);
  });
  clientConnection.emit('tweet', {body: 'Cats rule!'});
});

server.listen(8080);
```

node index.js
localhost:3210

`npm install socket.io --save`
`npm install nodemon -g` (Don't restart every time)

index.html
```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>TweetStream Baby</title>
  </head>
  <body>
    Giiiirlll
    <script src="https://cdn.socket.io/socket.io-1.4.5.js"></script>
    <script>
      const socket = io('http://localhost:8080');
      // Listen for events from the server (server emits tweets)
      socket.on('tweet', (tweet) => {
        console.log(tweet);
      });
    </script>
  </body>
</html>
```

Create twitter app here: `https://apps.twitter.com/`
go to keys at the bottom: Create my access token

`npm install twitter --save`

Create a .env file to put your twitter keys:
```
TWITTER_CONSUMER_KEY="pbPIqwgeYpUv1WeCLCeyB5of2"
TWITTER_CONSUMER_SECRET="J1Dsq6zGVPoWOiEX06tFxdhNUeexPumuEOXHjLGJuh8CJtF67Z"
TWITTER_ACCESS_TOKEN_KEY="724592614591307776-MmjzPYQdctiNu3VmpwE8t8R2yvxRLcc"
TWITTER_ACCESS_TOKEN_SECRET="5u9TmkfCvj3zXjavdT7Ms5vyZvV8LXgS64CkwaIDXzc1J"
```

install `npm install dotenv --save`
Ath the top of index.js: `require('dotenv').config();`
