require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Twitter = require("twitter");
var client = new Twitter(keys.twitter);
var chalk = require("chalk");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var liriOption = process.argv[2];
var liriTask = "";
var flag = false;
if(liriOption === "do-what-it-says"){
  fs.readFile('random.txt', "utf-8", (err, data) => {
    if (err) throw err;
    var items = data.split(",");
    liriOption = items[0].trim();
    if(items.length === 2){
      flag = true;
      liriTask = items[1].trim();
    }
    useLiriOptions(liriOption);
  });
}
else{
  useLiriOptions(liriOption);
}

function useLiriOptions(liriOption){
  switch(liriOption){
    case "my-tweets": 
    var params = {screen_name: 'nodejs', count: 20};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
      if (!error) {
        for(var i = 0; i < tweets.length; ++i){
          fs.appendFile("log.txt", 
          "Created at: " + tweets[i].created_at + "\n" + "Message: " + tweets[i].text
          , function(err) {
            if(err){
              console.log(err);
            }
          })
          console.log(chalk.yellow("Created at: ") + chalk.blue(tweets[i].created_at));
          console.log(chalk.yellow("Message: ") + chalk.blue(tweets[i].text));
        }
        
      }
    });
    break;
    case "spotify-this-song": 
    var songName = "";
    if(flag){
      songName = liriTask;
      flag = false;
    }
    else if(process.argv.length === 4){
      songName = process.argv[3];
    }
    else{
      songName = "The Sign by Ace of Base";
    }
    spotify.search({ type: 'track', query: songName}, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }
     for(var i = 0; i < data.tracks.items.length; ++i){
      fs.appendFile("log.txt","Names of the artists:\n" , function(err) {
        if(err){
          console.log(err);
        }
      })
      console.log(chalk.yellow("Names of the artists:"));
       for(var j = 0; j < data.tracks.items[i].artists.length; ++j ){
         console.log(chalk.blue(data.tracks.items[i].artists[j].name));
         fs.appendFile("log.txt",data.tracks.items[i].artists[j].name + "\n" , function(err) {
          if(err){
            console.log(err);
          }
        })
       }
       console.log(chalk.yellow("Name of the song: ") + chalk.blue( data.tracks.items[i].name));
       console.log(chalk.yellow("Preview link of the song: ") + chalk.blue( data.tracks.items[i].album.external_urls.spotify));
       console.log(chalk.yellow("Name of the album: ") + chalk.blue(data.tracks.items[i].album.name));
       fs.appendFile("log.txt",
       "Name of the song: " + data.tracks.items[i].name + '\n' +
       "Preview link of the song: " + data.tracks.items[i].album.external_urls.spotify + "\n" +
       "Name of the album: " + data.tracks.items[i].album.name
        , function(err) {
        if(err){
          console.log(err);
        }
      })
     }
    });
  break;
    case "movie-this": 
    var movieName = "";
    if(flag){
      movieName = liriTask;
      flag = false;
    }
    else if(process.argv.length === 4){
      movieName = process.argv[3];
    }
    else{
      movieName = "Mr. Nobody";
    }
    var queryURL =
    "https://www.omdbapi.com/?i=" +
    keys.omdb.i +
    "&apikey=" +
    keys.omdb.apikey +
    "&t=" + movieName;
  request(queryURL, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
      // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
      console.log(chalk.yellow("Title: ") + chalk.blue(JSON.parse(body).Title));
      console.log(chalk.yellow("Release Year: ") + chalk.blue(JSON.parse(body).Year));
      console.log(chalk.yellow("IMDB rating: ") + chalk.blue(JSON.parse(body).Ratings[0].Value));
      console.log(chalk.yellow("Rotten Tomatoes Rating: ") + chalk.blue(JSON.parse(body).Ratings[1].Value));
      console.log(chalk.yellow("Country: ") + chalk.blue(JSON.parse(body).Country));
      console.log(chalk.yellow("Language: ") + chalk.blue(JSON.parse(body).Language));
      console.log(chalk.yellow("Plot: ") + chalk.blue(JSON.parse(body).Plot));
      console.log(chalk.yellow("Actors: ") + chalk.blue(JSON.parse(body).Actors));
      fs.appendFile("log.txt", 
      "Title: " + JSON.parse(body).Title + "\n" +
      "Release Year: " + JSON.parse(body).Year + "\n" + 
      "IMDB rating: " + JSON.parse(body).Ratings[0].Value + "\n" +
      "Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\n" +
      "Country: " + JSON.parse(body).Country + "\n" +
      "Language: " + JSON.parse(body).Language + "\n" +
      "Plot: " + JSON.parse(body).Plot + "\n" +
      "Actors: " + JSON.parse(body).Actors + "\n"
      , function(err) {
        if(err){
          console.log(err);
        }
      })
    }
  });
  
  }  
}
