const { google } = require('googleapis');
const express = require('express');

var credentials = require('./authorization-data/credentials').installed;
var token = require('./authorization-data/token');

const app = express();

const port = 5000;

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
const authorize = (credentials) => {
  const client_secret = credentials["client_secret"]
    , client_id = credentials["client_id"]
    , redirect_uris = credentials["redirect_uris[0]"];

  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris);
  if (!token) return getAccessToken(oAuth2Client, callback);

  oAuth2Client.setCredentials(token);
  // return callback(oAuth2Client);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
const getAccessToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    return callback(oAuth2Client);
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
const listEvents = () => {
  const auth = authorize(credentials);
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    // const events = res.data.items;
    return res.data.items;
    // if (events.length) {
    // console.log('Upcoming 10 events:');
    //   return events.map((event, i) => {
    //     const start = event.start.dateTime || event.start.date;
    //     console.log(`${start} - ${event.summary}`);
    //   });
    // } else {
    //   console.log('No upcoming events found.');
    // }
  });
}
// authorize(credentials, listEvents);

app.get('/api/calendar', (req, res) => {
  const data = listEvents();
  if(!data) res.json('Error');
  const start = data.start.dateTime || data.start.date;
  console.log(`${start} - ${data.summary}`);
  // console.log('aaaaaaaaaaaa', data)
  res.json(`${start} - ${data.summary}`);
});
// console.log('aaaaaaaaaaaaaaaaaaaa', authorize(credentials, listEvents))

app.listen(port, () => console.log(`Server started on port ${port}`));