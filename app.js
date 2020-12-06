require('dotenv').config();

var request = require('request');
var cors = require('cors');
var express = require('express');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var app = express();
var userController = require('./controllers/usercontroller');
var playlistController = require('./controllers/playlistcontroller');
var playlistSongController = require('./controllers/playlistsongcontroller');
// var songs = require('./controllers/')
var sequelize = require('./db');

var client_id = '0dfcb20156444bc6a0b6807bd36a15f8';
var client_secret = '161c05b86cae409b925efd8f10100576';
var redirect_uri = 'http://localhost:5040/callback';

// generates a random string for completing Spotify oAuth

var generateRandomString = function (length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';
app.use(cors())
app.use(express.static(__dirname + '/public'))

    .use(cookieParser());

app.get('/login', function (req, res) {
    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    var scope = 'playlist-read-private ugc-image-upload playlist-modify-public playlist-modify-private user-follow-modify user-follow-read';
    res.redirect('https://accounts.spotify.com/authorize?' + querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

app.get('/callback', function (req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function (error, response, body) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, function (error, response, body) {
                    console.log(body);
                });

                // we can also pass the token to the browser to make requests from there
                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.get('/refresh_token', function (req, res) {

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

sequelize.sync();

app.use(express.json());
app.use(require('./middleware/headers'));


// app.get('/login', function (req, res) {
//     var scopes = 'playlist-read-private ugc-image-upload playlist-modify-public playlist-modify-private user-follow-modify user-follow-read';
//     var myClientID = '0dfcb20156444bc6a0b6807bd36a15f8';
//     var redirectUri = 'http://localhost:5040/callback'
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