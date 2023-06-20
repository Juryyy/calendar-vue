const fs = require('fs').promises;
const path = require('path');
const process = require('process');
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config({ path: './back-end/.env' });

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const CALENDAR_ID = process.env.CALENDAR_ID;


//Api cally
async function fetchEvents(auth : any){
    console.log(CALENDAR_ID)
    const client = await authorize();
    const calendar = google.calendar({version: 'v3', auth});
    const events = await calendar.events.list({
        calendarId: CALENDAR_ID,
        timeMin: (new Date()).toISOString(),
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
    });

    console.log(events.data.items);
}

//Funkce k ukládání token.json + authorize
async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

async function saveCredentials(client : OAuth2Client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
    let clientx = await loadSavedCredentialsIfExist();
    if (clientx) {
      return clientx;
    }
    let client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
  }
  

// finální funkce

authorize().then(fetchEvents).catch(console.error)
