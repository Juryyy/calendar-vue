const fs = require('fs').promises;
const path = require('path');
const process = require('process');
import { google } from 'googleapis';
import { authenticate } from '@google-cloud/local-auth';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config({ path: './back-end/.env' });

import { googleEvent} from '../types/DBtypes';
import { NextFunction } from 'express';

const SCOPES = ['https://www.googleapis.com/auth/calendar'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
const CALENDAR_ID = process.env.CALENDAR_ID;

//* Google api cally
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

async function createGoogleEvent(auth : any, data : any){
    const calendar = google.calendar({version: 'v3', auth});
    try{
    const event = await calendar.events.insert({
        calendarId: CALENDAR_ID,
        requestBody: {
            summary: data.summary,
            description: data.description,
            start: {
                dateTime: data.start.dateTime,
                timeZone: 'Europe/Prague',
            },
            end: {
                dateTime: data.end.dateTime,
                timeZone: 'Europe/Prague',
            },
        },
    });
  return { error: null };
  } catch (error: any) {
      console.log("error creating event", error);
  return {
    error: error.response?.data?.message ?? "Unknown error",
  };
}
}

async function updateGoogleEvent(auth: any, data: any){
  const calendar = google.calendar({version: 'v3', auth});
  try{
  const event = await calendar.events.update({
      calendarId: CALENDAR_ID,
      eventId: data.calEventId,
      requestBody: {
          summary: data.summary,
          description: data.description,
          start: {
              dateTime: data.start.dateTime,
              timeZone: 'Europe/Prague',
          },
          end: {
              dateTime: data.end.dateTime,
              timeZone: 'Europe/Prague',
          },
      },
  });
  return { error: null };
  } catch (error: any) {
      console.log("error editing event", error);
  return {
    error: error.response?.data?.message ?? "Unknown error",
  };
}
}

async function deleteEventCalendar(auth: any, calEventId: string){
  const calendar = google.calendar({version: 'v3', auth});
  try{
  const event = await calendar.events.delete({
      calendarId: CALENDAR_ID,
      eventId: calEventId,
  });
  return { error: null };
  } catch (error: any) {
      console.log("error deleting event", error);
  return {
    error: error.response?.data?.message ?? "Unknown error",
  }; 
}
}

//* Funkce k ukládání token.json + authorize
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


export {fetchEvents, createGoogleEvent, authorize, updateGoogleEvent, deleteEventCalendar};