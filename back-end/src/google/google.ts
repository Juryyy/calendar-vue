const fs = require('fs').promises;
const path = require('path');
const process = require('process');
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
import { googleEvent } from '@prisma/client';
dotenv.config({ path: './back-end/.env' });

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const CALENDAR_ID = process.env.CALENDAR_ID;

//Api cally
async function fetchEvents(auth : any){
  const calendar = google.calendar({version: 'v3', auth});
  try {
      const events = await calendar.events.list({
          calendarId: CALENDAR_ID,
          timeMin: (new Date()).toISOString(),
          maxResults: 100,
          singleEvents: true,
          orderBy: 'startTime',
      });
      return {events: events.data.items, error: null};
  } catch (error: any) {
      return {
          error: error.response?.data?.message ?? "Unknown error",
      };
  }
}

async function createEvent(auth : any, data : any){
    const calendar = google.calendar({version: 'v3', auth});
    try{
    const event = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: {
            summary: data.summary,
            description: data.description,
            start: {
                dateTime: data.start,
                timeZone: 'Europe/Prague',
            },
            end: {
                dateTime: data.end,
                timeZone: 'Europe/Prague',
            },
        },
    });
    console.log(event.data);
  return { error: null };
  } catch (error: any) {
  return {
    error: error.response?.data?.message ?? "Unknown error",
  };
}
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

export {fetchEvents, createEvent, authorize};

async function listEvents(auth : any) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    console.log(event);
  });
}

authorize().then(listEvents).catch(console.error);