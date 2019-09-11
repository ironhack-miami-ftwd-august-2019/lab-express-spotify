require('dotenv').config()

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require("spotify-web-api-node");

// require spotify-web-api-node package here:



const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res, next) => {
    res.render('index.hbs')
})

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.clientId,
    clientSecret: process.env.clientSecret
});


// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => {
        spotifyApi.setAccessToken(data.body["access_token"]);
    })
    .catch(error => {
        console.log("Something went wrong when retrieving an access token", error);
    });





//http://localhost:3000/searchArtists?artist=beatles

app.get('/searchArtists', (req, res, next) => {

    spotifyApi.searchArtists(req.query.artist).then(data => {                
        res.render('showArtists.hbs', { artistsToHBS: data.body.artists.items })
    })
    .catch(err => {
        console.log("The error while searching artists occurred: ", err);
    });

})

//http://localhost:3000/albums/52Qhb96Tc4f0zMSiqqRKr4

// req.params = { albumId: 52Qhb96Tc4f0zMSiqqRKr4 } 

app.get('/albums/:albumId', (req, res, next)=>{
    
    spotifyApi.getArtistAlbums(req.params.albumId).then(data => {
      res.render('album.hbs', {albumsToHBS: data.body.items})
    })
    .catch(err => {
        console.log("The error ", err);
    });


})


app.get('/tracks/:trackId', (req, res, next)=>{
    spotifyApi.getAlbumTracks(req.params.trackId).then(tracks => {
        console.log('tracks are',tracks.body.items)
        res.render('tracks.hbs', {tracksToHbs: tracks.body.items} )
    })
    .catch(err => {
        console.log("The error ", err);
    });
})

//'4ENxWWkPImVwAle9cpJ12I'











// setting the spotify-api goes here:






// the routes go here:



app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));