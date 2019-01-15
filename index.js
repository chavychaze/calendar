const { google } = require('googleapis');
const express = require('express');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const token = {
  access_token: process.env.ACCESS_TOKEN,
  refresh_token: process.env.REFRESH_TOKEN,
  scope: process.env.SCOPE,
  token_type: process.env.TOKEN_TYPE,
  expiry_date: process.env.EXPIRY_DATE
}

const app = express();

const port = process.env.PORT || 5000;

const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

const authorize = () => {
  const client_secret = process.env.CLIENT_SECRET,
    client_id = process.env.CLIENT_ID,
    redirect_uris = process.env.REDIRECT_URIS;

  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris);
  if (!token) return getAccessToken(oAuth2Client);

  oAuth2Client.setCredentials(token);
  return (oAuth2Client);
}

const getAccessToken = (oAuth2Client) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    return (oAuth2Client);
  });
}

const listEvents = async (callback) => {
  const auth = await authorize();
  const calendar = google.calendar({ version: 'v3', auth });
  calendar.events.list({
    calendarId: 'primary',
    timeMin: (new Date()).toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const events = res.data.items;
    if (events.length) {
      callback(events);
    } else {
      callback('No upcoming events found.');
    }
  });
}

app.get('/api/calendar', (req, res, next) => {
  listEvents((events, err) => {
    if (err) return next(err);
    console.log(typeof events);
    res.json(events);
  });
});

app.listen(port, () => console.log(`Server started on port ${port}`));