require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Twitter = require('twitter');

const twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

// Middleware: Search for static files in the public folder
app.use(express.static('public'));

io.on('connection', (clientConnection) => {
  //Remove existing searches before creating new ones:
  clientConnection.currentTwitterStream = null;
  //Gonna use this variable to set an interval for showing tweets
  clientConnection.nextTweet = null;
  const destroyStream = () => {
    if (clientConnection.currentTwitterStream) {
      clientConnection.currentTwitterStream.destroy();
    }
  };

  const search = (term) => {
    // npmjs.com/package/twitter
    twitterClient.stream('statuses/filter', {track: term}, (stream) => {
      //if there is an existing search, remove it; then, set it to the new search.
      destroyStream();
      clientConnection.currentTwitterStream = stream;

      // listen for new tweets and pass it to a stream function
      stream.on('data', (tweet) => {
        clientConnection.nextTweet = tweet;
      });
      stream.on('error', (error) => {
        console.log(error);
      });
    });
  }
  // flow: clientConnection emits search event. Server listens for hashtag event and emits tweet events
  clientConnection.on('search', (term) => {
    search(term);
  });

  setInterval(() => {
    if (clientConnection.nextTweet) {
      //show that tweet(object) to the one client
      clientConnection.emit('tweet', clientConnection.nextTweet);
      //set nextTweet to null so that the tweets don't repeat themselves
      clientConnection.nextTweet = null;
    }
  }, 333);
  //Making sure there is no twitter searches open when user disconnects
  clientConnection.on('disconnect', () => {
    destroyStream();
  });
});

server.listen(8080);
