//code to read and set any environment variables with the dotenv package
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");

var appCommand = process.argv[2];
console.log("appCommand: " + appCommand);

//slice after the 3rd position
var userSearch = process.argv.slice(3).join(" ");
console.log("userSearch: " + userSearch);

//Using switch statement to execute the code appropriate to the appCommand that is inputed from the user
function liriSearch(appCommand, userSearch) {
    switch (appCommand) {
        case "spotify-this-song":
            getSpotify(userSearch);
            break;

        case "concert-this":
            getConcertInfo(userSearch);
            break;

        case "movie-this":
            getOMDB(userSearch);
            break;

        case "do-what-it-says":
            getStatic();
            break;
        default:
            console.log("Invalid Option. Please enter one of the following commands: 'concert-this', 'spotify-this-song', 'movie-this', 'do-what-it-says' in order to continue");
    }
};

//search Music Info on Spotify API
function getSpotify(songName) {
    // spotify key
    var spotify = new Spotify(keys.spotify);

    if (!songName) {
        songName = "Party all the time";//default Song
    };
    spotify.search({ type: 'track', query: songName },

        function (err, data) {
        if (err) {
            console.log("Error occurred: " + err);
            return;
        }

        console.log("==============================================");
        fs.appendFileSync("searchlogs.txt", "==============================================\n");

        var songs = data.tracks.items;

        for (var i = 0; i < songs.length; i++) {
            console.log(i);
            console.log("*****************SPOTIFY SONG SEARCH BEGIN*****************");
            fs.appendFileSync("searchlogs.txt", i +"\n");
            fs.appendFileSync("searchlogs.txt", "*****************SPOTIFY SONG SEARCH BEGIN*****************\n");
            console.log("Song name: " + songs[i].name);
            fs.appendFileSync("searchlogs.txt", "song name: " + songs[i].name +"\n");
            console.log("Song Preview Link:: " + songs[i].preview_url);
            fs.appendFileSync("searchlogs.txt", "preview song: " + songs[i].preview_url +"\n");
            console.log("Album: " + songs[i].album.name);
            fs.appendFileSync("searchlogs.txt", "album: " + songs[i].album.name + "\n");
            console.log("Artist(s): " + songs[i].artists[0].name);
            fs.appendFileSync("searchlogs.txt", "artist(s): " + songs[i].artists[0].name + "\n");
            console.log("**********SPOTIFY SONG INFO END*********");
            fs.appendFileSync("searchlogs.txt", "*****************SPOTIFY SONG SEARCH END*****************\n");
         }
    });

};

//search Concert Info using Bands In Town API
function getConcertInfo(artist) {
            var artist = userSearch;
            var bandQueryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"

            axios.get(bandQueryURL).then(
            function (response, error) {
            // adding a line break for clarity of when search results begin
            console.log("=======================================================================================================");
            fs.appendFileSync("searchlogs.txt", "=======================================================================================================\n");
            //console.log("response is");
            //console.log(response);

            if(!error && response.status === 200){
                console.log("response status is "+response.status);
                var concerts = response.data;
                for (var i = 0; i < concerts.length; i++) {
                console.log(i);

                console.log("**********CONCERTS NEAR YOU, EVENT INFO BEGIN*********");
                fs.appendFileSync("searchlogs.txt", i +"\n");
                fs.appendFileSync("searchlogs.txt", "**********CONCERTS NEAR YOU, EVENT INFO BEGIN*********\n");

                console.log("Name of the venue: " + response.data[i].venue.name);
                fs.appendFileSync("searchlogs.txt", "Name of the venue: " + response.data[i].venue.name +"\n");

                console.log("Venue Location: " + response.data[i].venue.city);
                fs.appendFileSync("searchlogs.txt", "Venue Location: " + response.data[i].venue.city +"\n");

                console.log("Date of the Event: " + moment(response.data[i].datetime).format("MM-DD-YYYY"));
                fs.appendFileSync("searchlogs.txt", "Date of the Event: " + moment(response.data[i].datetime).format("MM-DD-YYYY") +"\n");

                console.log("Event URL: " + response.data[i].url);
                fs.appendFileSync("searchlogs.txt", "Event URL: " + response.data[i].url +"\n");

                console.log("**********BANDS IN TOWN EVENT INFO END*********");
                fs.appendFileSync("searchlogs.txt", "**********CONCERTS NEAR YOU, EVENT INFO END*********\n");

            }
            }
            else{
                console.log('error occurred.');
                console.log("response status is "+response.status);
            }

            }).catch(function(error) {
                if (error.response) {
                  // The request was made and the server responded with a status code
                  // that falls out of the range of 2xx
                  console.log("---------------Data---------------");
                  console.log(error.response.data);
                  console.log("---------------Status---------------");
                  console.log(error.response.status);
                  console.log("---------------Status---------------");
                  console.log(error.response.headers);
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` is an object that comes back with details pertaining to the error that occurred.
                  console.log(error.request);
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log("Error", error.message);
                }
                console.log(error.config);
              });
        };

//Function to search Movie Info using OMDB API
function getOMDB(movie) {
            console.log("movie: " + movie);
            //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
            if (!movie) {
                movie = "Mr. Nobody";
                console.log("=======================================================================================================");
                fs.appendFileSync("searchlogs.txt", "=======================================================================================================\n");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                fs.appendFileSync("searchlogs.txt", "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/" +"\n");
                console.log("It's on Netflix!");
                fs.appendFileSync("searchlogs.txt", "It's on Netflix!\n");
            }
            var movieQueryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
            console.log("movie query url is- " +movieQueryUrl);

            axios.request(movieQueryUrl).then(
                function (response, error) {
                // adding a line break for clarity of when search results begin
                console.log("=======================================================================================================");
                fs.appendFileSync("searchlogs.txt", "=======================================================================================================\n");
                //console.log("response is");
                //console.log(response);
                if(!error && response.status === 200){
                    console.log("response status is "+response.status);

                    console.log("**********OMDB MOVIE INFO BEGIN*********");
                    fs.appendFileSync("searchlogs.txt", "**********OMDB MOVIE INFO BEGIN*********\n");

                    console.log("Movie Title: " + response.data.Title);
                    fs.appendFileSync("searchlogs.txt", "Movie Title: " + response.data.Title +"\n");

                    console.log("Release Year: " + response.data.Year);
                    fs.appendFileSync("searchlogs.txt", "Release Year: " + response.data.Year +"\n");

                    console.log("IMDB Rating: " + response.data.imdbRating);
                    fs.appendFileSync("searchlogs.txt", "IMDB Rating: " + response.data.imdbRating +"\n");

                    console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                    fs.appendFileSync("searchlogs.txt", "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value +"\n");

                    console.log("Country of Production: " + response.data.Country);
                    fs.appendFileSync("searchlogs.txt", "Country of Production: " + response.data.Country +"\n");

                    console.log("Language: " + response.data.Language);
                    fs.appendFileSync("searchlogs.txt", "Language: " + response.data.Language +"\n");

                    console.log("Plot: " + response.data.Plot);
                    fs.appendFileSync("searchlogs.txt", "Plot: " + response.data.Plot +"\n");

                    console.log("Actors: " + response.data.Actors);
                    fs.appendFileSync("searchlogs.txt", "Actors: " + response.data.Actors +"\n");

                    console.log("Awards: " + response.data.Awards);
                    fs.appendFileSync("searchlogs.txt", "Awards: " + response.data.Awards +"\n");

                    console.log("Poster URL: " + response.data.Poster);
                    fs.appendFileSync("searchlogs.txt", "Poster URL: " + response.data.Poster +"\n");

                    console.log("**********OMDB MOVIE INFO END*********");
                    fs.appendFileSync("searchlogs.txt", "**********OMDB MOVIE INFO END*********\n");

                }
                ELSE{
                    CONSOLE.LOG('ERROR OCCURRED.');
                    CONSOLE.LOG("RESPONSE STATUS IS "+RESPONSE.STATUS);
                }

            }).catch(function(error) {
                if (error.response) {
                  // server status code response
                  console.log("---------------Data---------------");
                  console.log(error.response.data);
                  console.log("---------------Status---------------");
                  console.log(error.response.status);
                  console.log("---------------Status---------------");
                  console.log(error.response.headers);

				  //Created for no response
                } else if (error.request) {
                  // The request was made but no response was received
                  // `error.request` any problem with the api request
                  console.log(error.request);
                } else {

                  console.log("Error:", error.message);
                }
                console.log(error.config);
              });
        };
//reads out  staticfile.txt file if no song is given.
function getStatic() {
            fs.readFile("staticfile.txt", "utf8", function (error, data) {
                if (error) {
                    return console.log(error);

                } else {
                    console.log(data);

                    var staticData = data.split(",");
                    liriSearch(staticData[0], staticData[1]);
                }

            })
            ;
        };

//Execute function
liriSearch(appCommand, userSearch);
