import {NextFunction, Request, Response } from "express";
import eventService from "../services/event-service";
import { inputEvent, googleEvent } from "@prisma/client";
import { authorize, fetchEvents} from "../google/google";

export default {

  
  async getEventsForMonth(req: Request, res: Response, next: NextFunction) {
    const month = parseInt(req.params.month);
    const events = await eventService.googleEvent.getEventsForMonth(month);
    let eventsToSend : any[] = [];
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let eventToSend = {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        startTime: event.start.toISOString().split('T')[1].slice(0,5),
        endDate: new Date(event.end).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        endTime: event.end.toISOString().split('T')[1].slice(0,5),
        calEventId: event.calEventId,
        userId: event.userId   
      };
      eventsToSend.push(eventToSend);
    }
    res.json(eventsToSend);
  },

  async getEventsForUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if(userId){
    const events = await eventService.googleEvent.getEventsByUserId(userId);
    if(events){
    let eventsToSend : any[] = [];
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      let eventToSend = {
        id: event.id,
        title: event.title,
        description: event.description,
        startDate: new Date(event.start).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        startTime: event.start.toISOString().split('T')[1].slice(0,5),
        endDate: new Date(event.end).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        endTime: event.end.toISOString().split('T')[1].slice(0,5),
        calEventId: event.calEventId,
        userId: event.userId   
      };
      eventsToSend.push(eventToSend);
    }
    res.json(eventsToSend);
  } else {
    res.status(400).json({ error: "No events found" });
  }
  } else {
    res.status(400).json({ error: "No user found" });
  }
},
  // * Fetch events from google calendar and save them to database
  async fetchEventsFromG(req: Request, res: Response, next: NextFunction) {
    const auth = await authorize();
    const response = await fetchEvents(auth);
    if (response.error !== null) {
      return response.error;
    } else {
      if (response.events) {
        for (let event of response.events) {
          if (
            event.summary &&
            event.description &&
            event.start &&
            event.end &&
            event.id &&
            event.start.dateTime &&
            event.end.dateTime
          ) {
            const calEventId = event.id;
            const existingEvent =
              await eventService.googleEvent.getEventByCalEventId(calEventId);
            if (!existingEvent) {
              const adjustedStart = new Date(event.start.dateTime);
              adjustedStart.setHours(adjustedStart.getHours() + 2);

              const adjustedEnd = new Date(event.end.dateTime);
              adjustedEnd.setHours(adjustedEnd.getHours() + 2);

              const eventToSave: Omit<googleEvent, "id"> = {
                title: event.summary.split(" ### ")[0],
                description: event.description,
                start: adjustedStart,
                end: adjustedEnd,
                userId: parseInt(event.summary.split(" ### ")[1]),
                calEventId: calEventId,
              };
              await eventService.googleEvent.createEvent(eventToSave);
            }
          }
        }
      }
    }
    console.log("fetchEvents from google uspesne dokoncen")
    next();
  },

  async getNextEventForUser(req: Request, res: Response, next: NextFunction) {
    const userId = req.user?.id;
    if (userId) {
      const event = await eventService.googleEvent.getUpcomingEventForUser(userId);
      if (event) {
        let eventToSend = {
          id: event.id,
          title: event.title,
          description: event.description,
          startDate: new Date(event.start).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
          startTime: event.start.toISOString().split('T')[1].slice(0,5),
          endDate: new Date(event.end).toLocaleDateString('de-DE', {day: '2-digit', month: '2-digit', year: 'numeric'}),
          endTime: event.end.toISOString().split('T')[1].slice(0,5),
          calEventId: event.calEventId,
          userId: event.userId   
        };
        res.json(eventToSend);
      } else {
        res.status(400).json({ error: "No events found" });
      }
    } else {
      res.status(400).json({ error: "No user found" });
    }
  },
};
