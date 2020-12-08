require('dotenv').config();

let request = require('request');
let express = require('express');
let querystring = require('querystring');
let cookieParser = require('cookie-parser');
let app = express();
let userController = require('./controllers/usercontroller');
let playlistController = require('./controllers/playlistcontroller');
let playlistSongController = require('./controllers/playlistsongcontroller');
let sequelize = require('./db');

// ! The below code that is commented out is related to Spotify oAuthentication, which will be implemented in version 2.0

// let redirect_uri = 'http://localhost:5040/callback';

// generates a random string for completing Spotify oAuth
// let generateRandomString = function (length) {
//     let text = '';
//     let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

//     for (let i = 0; i < length; i++) {
//         text += possible.charAt(Math.floor(Math.random() * possible.length));
//     }
//     return text;
// };

// let stateKey = 'spotify_auth_state';
// app.use(express.static(__dirname + '/public'))

//     .use(cookieParser());

// app.get('/login', function (req, res) {
//     let state = generateRandomString(16);
//     res.cookie(stateKey, state);

//     let scope = 'playlist-read-private ugc-image-upload playlist-modify-public playlist-modify-private user-follow-modify user-follow-read';
//     res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
//         response_type: 'code',
//         client_id: client_id,
//         scope: scope,
//         redirect_uri: redirect_uri,
//         state: state
//     }));
// });

// app.get('/callback', function (req, res) {

//     // your application requests refresh and access tokens
//     // after checking the state parameter

//     let code = req.query.code || null;
//     let state = req.query.state || null;
//     let storedState = req.cookies ? req.cookies[stateKey] : null;

//     if (state === null || state !== storedState) {
//         res.redirect('/#' +
//             querystring.stringify({
//                 error: 'state_mismatch'
//             }));
//     } else {
//         res.clearCookie(stateKey);
//         let authOptions = {
//             url: 'https://accounts.spotify.com/api/token',
//             form: {
//                 code: code,
//                 redirect_uri: redirect_uri,
//                 grant_type: 'authorization_code'
//             },
//             headers: {
//                 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
//             },
//             json: true
//         };

//         request.post(authOptions, function (error, response, body) {
//             if (!error && response.statusCode === 200) {

//                 let access_token = body.access_token,
//                     refresh_token = body.refresh_token;

//                 let options = {
//                     url: 'https://api.spotify.com/v1/me',
//                     headers: { 'Authorization': 'Bearer ' + access_token },
//                     json: true
//                 };

//                 // use the access token to access the Spotify Web API
//                 request.get(options, function (error, response, body) {
//                     console.log(body);
//                 });

//                 // we can also pass the token to the browser to make requests from there
//                 res.redirect('/#' +
//                     querystring.stringify({
//                         access_token: access_token,
//                         refresh_token: refresh_token
//                     }));
//             } else {
//                 res.redirect('/#' +
//                     querystring.stringify({
//                         error: 'invalid_token'
//                     }));
//             }
//         });
//     }
// });

// app.get('/refresh_token', function (req, res) {

//     // requesting access token from refresh token
//     let refresh_token = req.query.refresh_token;
//     let authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
//         form: {
//             grant_type: 'refresh_token',
//             refresh_token: refresh_token
//         },
//         json: true
//     };

//     request.post(authOptions, function (error, response, body) {
//         if (!error && response.statusCode === 200) {
//             let access_token = body.access_token;
//             res.send({
//                 'access_token': access_token
//             });
//         }
//     });
// });

sequelize.sync();

app.use(express.json());
app.use(require('./middleware/headers'));


// app.get('/login', function (req, res) {
//     let scopes = 'playlist-read-private ugc-image-upload playlist-modify-public playlist-modify-private user-follow-modify user-follow-read';
//     let myClientID = '';
//     let redirectUri = 'http://localhost:5040/callback'
//     res.redirect('https://accounts.spotify.com/authorize' +
//         '?response_type=code' +
//         '&client_id=' + myClientID +
//         (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//         '&redirect_uri=' + redirectUri + '&code_challenge_method=s256' + '&code_challenge=');
// });

app.use('/user', userController);
app.use(require('./middleware/validate-session'));
app.use('/playlist', playlistController);
app.use('/playlistsong', playlistSongController);

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});